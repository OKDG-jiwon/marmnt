// Document Ready
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Initialize all features
    handleScroll();
    fixedHeader();
    handleNav();
    bottomNav();
    searchLayer();
    topBanner();
    observeTopCategory(); // 상단 카테고리 변경 감지
    top_category(); // 상단 카테고리 초기화
    setupQuickGoTop(); // 상단 이동 버튼
}

// Handle scrolling events
function handleScroll() {
    let lastScrollY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                fixedHeader(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Fixed header
function fixedHeader(scrollY) {
    const header = document.getElementById('header');
    const contents = document.getElementById('contents');

    if (scrollY > header.offsetTop) {
        header.classList.add('fixed');
        contents.style.marginTop = `${header.offsetHeight}px`;
    } else {
        header.classList.remove('fixed');
        contents.style.marginTop = '0px';
    }
}

function handleNav() {
    const navButtons = document.querySelectorAll('.eNavFold'); // 메뉴 버튼
    const closeButton = document.querySelector('#aside .btnClose'); // 닫기 버튼
    const dimmed = document.getElementById('layoutDimmed'); // 어두운 배경
    const body = document.body; // body 요소

    // 메뉴 버튼 클릭 시 모달 열기
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            body.classList.add('expand'); // expand 클래스 추가
        });
    });

    // 닫기 버튼 클릭 시 모달 닫기
    closeButton.addEventListener('click', closeModal);

    // 어두운 배경 클릭 시 모달 닫기
    dimmed.addEventListener('click', closeModal);

    // 모달 닫는 함수
    function closeModal() {
        body.classList.remove('expand'); // expand 클래스 제거
    }
}

// DOM이 로드되면 이벤트 바인딩
document.addEventListener('DOMContentLoaded', handleNav);


// Handle search layer toggle
function searchLayer() {
    const searchButtons = document.querySelectorAll('.eSearch');
    const closeButton = document.querySelector('.xans-layout-searchheader .btnClose');
    const dimmed = document.querySelector('#layoutDimmed');

    searchButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.classList.add('searchExpand');
        });
    });

    closeButton.addEventListener('click', () => {
        document.body.classList.remove('searchExpand');
    });

    handleDimmed(dimmed, 'searchExpand');
}

// Handle bottom navigation
function bottomNav() {
    let lastScrollY = 0;
    const nav = document.querySelector('.bottom-nav');
    const btnTop = document.querySelector('.bottom-nav__top');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            nav.classList.add('bottom-nav--hide');
        } else {
            nav.classList.remove('bottom-nav--hide');
        }

        // Show/hide top button
        if (getCurrentScrollPercentage() > 30) {
            btnTop.classList.add('bottom-nav__top--show');
        } else {
            btnTop.classList.remove('bottom-nav__top--show');
        }

        lastScrollY = Math.max(currentScrollY, 0);
    });

    btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Handle top banner
function topBanner() {
    const banner = document.querySelector('#topBanner');
    if (!banner) return;

    const closeButton = banner.querySelector('.btnClose');
    closeButton.addEventListener('click', () => {
        banner.classList.add('hidden');
    });
}

// Handle quick go-to-top button
function setupQuickGoTop() {
    const btnTop = document.querySelector('#quick .pageTop');
    if (!btnTop) return;

    btnTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
}

// Observe changes in top categories
function observeTopCategory() {
    const targetNode = document.querySelector('#header .xans-layout-category > ul');
    if (!targetNode) return;

    const observer = new MutationObserver(() => {
        top_category(); // Update categories
    });

    observer.observe(targetNode, { childList: true, subtree: true });
}

// Top categories hover behavior
function top_category() {
    const categories = document.querySelectorAll('#header .top_category li');
    categories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            category.classList.add('on');
        });

        category.addEventListener('mouseleave', () => {
            category.classList.remove('on');
        });
    });

    const subCategories = document.querySelectorAll('#header .top_category ul.sub_cate01 li');
    subCategories.forEach(subCategory => {
        if (!subCategory.querySelector('ul')) {
            subCategory.classList.add('noChild');
        }
    });
}

// Get current scroll percentage
function getCurrentScrollPercentage() {
    return ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;
}
