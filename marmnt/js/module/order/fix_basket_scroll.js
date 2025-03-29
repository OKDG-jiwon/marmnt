/**
 * 장바구니 페이지 스크롤 수정 스크립트
 */
(function() {
    // 페이지 로드 후 실행
    window.addEventListener('DOMContentLoaded', function() {
        fixBasketScroll();
    });

    // 추가적으로 window.onload 이벤트에도 적용
    window.addEventListener('load', function() {
        fixBasketScroll();
        // 약간의 딜레이 후 한 번 더 적용 (동적 로드 요소 때문)
        setTimeout(fixBasketScroll, 500);
    });

    function fixBasketScroll() {
        // 원래의 fixedHeader 함수를 오버라이드
        if (typeof window.originalFixedHeader === 'undefined' && typeof window.fixedHeader === 'function') {
            window.originalFixedHeader = window.fixedHeader;
            window.fixedHeader = function() {
                // 장바구니 페이지에서는 아무 동작도 하지 않음
                console.log('Header fixed function disabled for basket page');
                return;
            };
        }

        // wrap 요소에 overflow: auto 적용
        var wrapElement = document.getElementById('wrap');
        if (wrapElement) {
            wrapElement.style.overflow = 'auto';
            wrapElement.style.height = 'auto';
            wrapElement.style.minHeight = '100%';
        }

        // container 요소에 overflow: auto 적용
        var containerElement = document.getElementById('container');
        if (containerElement) {
            containerElement.style.overflow = 'auto';
            containerElement.style.height = 'auto';
            containerElement.style.minHeight = '100%';
        }

        // contents 요소에 overflow: auto 적용 및 margin-top 제거
        var contentsElement = document.getElementById('contents');
        if (contentsElement) {
            contentsElement.style.overflowY = 'auto';
            contentsElement.style.height = 'auto';
            contentsElement.style.minHeight = '100%';
            contentsElement.style.position = 'relative';
            contentsElement.style.marginTop = '0';
        }

        // cart-container 요소에 overflow: auto 적용
        var cartContainerElements = document.getElementsByClassName('cart-container');
        for (var i = 0; i < cartContainerElements.length; i++) {
            cartContainerElements[i].style.overflowY = 'auto';
            cartContainerElements[i].style.height = 'auto';
            cartContainerElements[i].style.minHeight = '100%';
            cartContainerElements[i].style.display = window.innerWidth > 1024 ? 'flex' : 'block';
        }

        // cart-product 요소에 overflow: auto 적용
        var cartProductElements = document.getElementsByClassName('cart-product');
        for (var i = 0; i < cartProductElements.length; i++) {
            cartProductElements[i].style.overflowY = 'auto';
            cartProductElements[i].style.height = 'auto';
            cartProductElements[i].style.minHeight = '100%';
            cartProductElements[i].style.width = '100%';
        }

        // 최상단 배너가 스크롤에 영향을 주지 않도록 수정
        var topBanner = document.querySelector('.main_top_banner');
        if (topBanner) {
            topBanner.style.position = 'static';
            topBanner.style.zIndex = 'auto';
        }

        // 장바구니 패키지 영역에 스크롤 가능하게
        var basketPackage = document.querySelector('.xans-order-basketpackage');
        if (basketPackage) {
            basketPackage.style.overflowY = 'auto';
            basketPackage.style.height = 'auto';
            basketPackage.style.minHeight = '100%';
            basketPackage.style.position = 'relative';
            basketPackage.style.paddingBottom = '50px';
        }

        // body에도 스크롤 설정
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
        document.body.style.position = 'relative';

        // 헤더 요소에 고정 스타일 적용해서 깜빡임 방지
        var headerElement = document.getElementById('header');
        if (headerElement) {
            headerElement.style.position = 'relative'; // fixed 대신 relative 사용
            headerElement.style.zIndex = '998';
            headerElement.style.top = '0';
            headerElement.style.transform = 'none';
            headerElement.style.webkitTransform = 'none';
            headerElement.style.msTransform = 'none';
            headerElement.style.transition = 'none';
            
            // fixed 클래스가 토글되는 것을 방지
            headerElement.classList.remove('fixed');
            
            // 스크롤 이벤트에서 헤더 관련 코드 실행 방지
            window.removeEventListener('scroll', window.headerScrollHandler);
        }

        // 기존 스크롤 이벤트 핸들러 제거 및 새로운 핸들러 등록
        window.removeEventListener('scroll', preventHeaderFlashing);
        window.addEventListener('scroll', preventHeaderFlashing);

        // 추가로 스크롤 이벤트를 모니터링하고 필요시 다시 스타일 적용
        var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.addEventListener('scroll', function() {
            var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 스크롤 방향 변경 감지 (중요한 변화가 있을 때만 재적용)
            if (Math.abs(currentScrollTop - lastScrollTop) > 30) {
                setTimeout(preventHeaderFlashing, 0);
                lastScrollTop = currentScrollTop;
            }
        });

        console.log('장바구니 페이지 스크롤 수정 완료');
    }

    // 스크롤 시 헤더 깜빡임 방지
    function preventHeaderFlashing() {
        var headerElement = document.getElementById('header');
        if (headerElement) {
            // 스크롤 시에 fixed 클래스를 제거하고 강제로 relative 상태 유지
            headerElement.classList.remove('fixed');
            headerElement.style.position = 'relative';
            headerElement.style.transform = 'none';
            headerElement.style.webkitTransform = 'none';
            headerElement.style.msTransform = 'none';
            headerElement.style.top = '0';
            
            // layout3 클래스를 토글하지 않도록 항상 유지
            if (!headerElement.classList.contains('layout3')) {
                headerElement.classList.add('layout3');
            }
            
            // contents 요소의 margin-top을 0으로 설정
            var contentsElement = document.getElementById('contents');
            if (contentsElement) {
                contentsElement.style.marginTop = '0';
            }
        }
    }

    // 기존의 헤더 이벤트 핸들러 저장
    window.headerScrollHandler = window.onscroll;
})();
