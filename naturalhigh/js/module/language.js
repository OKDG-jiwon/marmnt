document.addEventListener("DOMContentLoaded", function () {
    const languageToggles = document.querySelectorAll('.menu.btnLanguageToggle, .icon-link.menu.btnLanguageToggle');

    function addEventListenersToToggles(toggles) {
        toggles.forEach(toggle => {
            toggle.addEventListener('click', toggleLanguage);
            toggle.addEventListener('touchstart', toggleLanguage);
        });
    }

    const API_KEY = 'AIzaSyCmu-6nwIq81WOV5t4bL4SRMIBUkM3JGgQ'; // Google Translate API 키
    const koreanRegex = /[\uac00-\ud7af]/; // 한글 탐지 정규식
    const priceRegex = /\$([\d,\.]+)/; // 달러 금액 탐지 정규식
    const koreanPriceRegex = /([\d,]+)\s*원$/; // 한화 금액 탐지 정규식
    const excludeIDs = ['excludeID1', 'excludeID2'];

    let isTranslating = false; // 중복 실행 방지 플래그

    // 초기 언어 및 국가 표시 업데이트
    function updateLanguageDisplay() {
        const currentLanguage = document.documentElement.lang;

        const countryElement = document.getElementById('country');
        const languageElement = document.getElementById('language');

        if (currentLanguage === 'ko') {
            if (countryElement) countryElement.textContent = 'COUNTRY: Korea';
            if (languageElement) languageElement.textContent = 'LANGUAGE: 한국어';
        } else {
            if (countryElement) countryElement.textContent = 'COUNTRY: International';
            if (languageElement) languageElement.textContent = 'LANGUAGE: English';
        }
    }

    // 저장된 언어를 불러오기
    function initializeLanguage() {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            document.documentElement.lang = savedLanguage; // 저장된 언어로 설정
        } else {
            document.documentElement.lang = 'ko'; // 기본값: 한국어
            localStorage.setItem('selectedLanguage', 'ko'); // 기본값 저장
        }
        updateLanguageDisplay();
        updateCurrency(document.documentElement.lang);
        translatePage(document.documentElement.lang); // 페이지 초기 번역 적용
    }

    // 금액 변환 함수
    function updateCurrency(targetLanguage) {
        const elementsToTranslate = document.querySelectorAll('*:not(script):not(style):not([data-ignore])');

        for (const element of elementsToTranslate) {
            if (excludeIDs.includes(element.id)) continue; // ID가 제외 목록에 있는 경우 무시

            const childNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);

            for (const node of childNodes) {
                const textContent = node.textContent.trim();

                if (targetLanguage === 'ko' && priceRegex.test(textContent)) {
                    const match = textContent.match(priceRegex);
                    if (match) {
                        const dollarValue = parseFloat(match[1].replace(/,/g, ''));
                        const koreanPrice = `${(dollarValue * 1300).toFixed(0)}원`;
                        node.textContent = node.parentNode.dataset.originalPrice || koreanPrice;
                        node.parentNode.dataset.originalPrice = koreanPrice;
                    }
                }

                if (targetLanguage === 'en' && koreanPriceRegex.test(textContent)) {
                    const match = textContent.match(koreanPriceRegex);
                    if (match) {
                        const numericValue = parseFloat(match[1].replace(/,/g, ''));
                        const convertedPrice = `$${(numericValue / 1300).toFixed(2)}`;
                        node.parentNode.dataset.originalPrice = textContent;
                        node.textContent = convertedPrice;
                    }
                }
            }
        }
    }

    // 텍스트 번역 및 업데이트 함수
    async function translatePage(targetLanguage) {
        if (isTranslating) return; // 중복 실행 방지
        isTranslating = true;

        const elementsToTranslate = document.querySelectorAll('*:not(script):not(style):not([data-ignore])');
        const translationPromises = [];

        for (const element of elementsToTranslate) {
            if (excludeIDs.includes(element.id)) continue; // ID가 제외 목록에 있는 경우 무시

            const childNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);

            for (const node of childNodes) {
                const text = node.textContent.trim();

                if (targetLanguage === 'en' && koreanRegex.test(text)) {
                    const originalText = node.parentNode.dataset.original || text;

                    if (!node.parentNode.dataset.original) {
                        node.parentNode.dataset.original = originalText;
                    }

                    const promise = translateText(originalText, targetLanguage)
                        .then(translatedText => {
                            node.textContent = translatedText;
                        })
                        .catch(error => console.error('번역 오류:', error));

                    translationPromises.push(promise);
                }

                if (targetLanguage === 'ko') {
                    const originalText = node.parentNode.dataset.original;
                    if (originalText) {
                        node.textContent = originalText;
                    }
                }
            }
        }

        await Promise.all(translationPromises);
        console.log('번역 완료 및 업데이트 완료');
        isTranslating = false; // 번역 완료 후 플래그 해제
    }

    async function translateText(text, targetLanguage) {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLanguage,
            }),
        });

        if (!response.ok) {
            console.error('Translation API Error:', await response.text());
            throw new Error('Translation API 요청 실패');
        }

        const result = await response.json();
        return result.data.translations[0].translatedText;
    }

    // 언어 토글 버튼 클릭 이벤트
    async function toggleLanguage(event) {
        event.stopPropagation();
        if (isTranslating) return; // 중복 실행 방지

        const currentLanguage = document.documentElement.lang;

        if (currentLanguage === 'ko') {
            document.documentElement.lang = 'en';
            localStorage.setItem('selectedLanguage', 'en'); // 언어 설정 저장
            updateCurrency('en');
            await translatePage('en');
        } else {
            document.documentElement.lang = 'ko';
            localStorage.setItem('selectedLanguage', 'ko'); // 언어 설정 저장
            updateCurrency('ko');
            await translatePage('ko');
        }
        updateLanguageDisplay();
    }

    // ** 페이지 로드 시 저장된 언어로 초기화 **
    initializeLanguage();

    // 페이지 활성화 시 저장된 언어 유지
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            const savedLanguage = localStorage.getItem('selectedLanguage');
            if (savedLanguage && document.documentElement.lang !== savedLanguage) {
                document.documentElement.lang = savedLanguage;
                updateLanguageDisplay();
                updateCurrency(savedLanguage);
                translatePage(savedLanguage); // 저장된 언어로 번역
            }
        }
    });

    // 디버깅용 로컬 스토리지 변화 추적
    window.addEventListener('storage', (event) => {
        if (event.key === 'selectedLanguage') {
            console.log('selectedLanguage changed:', event.newValue);
        }
    });
});