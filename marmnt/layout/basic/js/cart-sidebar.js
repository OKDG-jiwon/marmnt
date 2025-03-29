/**
 * 장바구니 사이드바 기능
 */

// Cafe24 기본 Basket 객체에 필요한 함수 추가
window.Basket = window.Basket || {};

// isInProgressMigrationCartData 함수가 없어서 발생하는 오류 해결
if (typeof window.Basket.isInProgressMigrationCartData !== 'function') {
    window.Basket.isInProgressMigrationCartData = function() {
        return false;
    };
}

/**
 * 사이드 장바구니 닫기 함수
 */
function closeSideCart() {
    $('.cart-sidebar').removeClass('active').hide();
    $('.cart-sidebar-overlay').hide();
    $('.floating-close-btn').hide();
}

/**
 * iframe 내부의 스타일 적용
 */
function applyIframeStyles(iframe) {
    try {
        if (!iframe || !iframe.contentDocument) return;
        
        var iframeDoc = iframe.contentDocument;
        var iframeHead = iframeDoc.head;
        
        // 스타일을 직접 삽입
        var styleTag = iframeDoc.createElement('style');
        styleTag.innerHTML = `
            html, body {
                overflow-y: auto !important;
                height: 100% !important;
                position: relative !important;
                padding: 0 !important;
                margin: 0 !important;
                max-height: none !important;
                scrollbar-width: thin !important;
            }
            
            #container, #wrap {
                height: 100% !important;
                min-height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow-y: auto !important;
                position: relative !important;
            }
            
            #contents {
                padding-top: 0 !important;
                overflow-y: auto !important;
                height: 100% !important;
                min-height: 100% !important;
                position: relative !important;
            }
            
            .xans-order-basketpackage {
                overflow-y: auto !important;
                height: auto !important;
                min-height: 100% !important;
                position: relative !important;
            }
            
            .cart-container {
                display: block !important;
                overflow-y: auto !important;
                height: auto !important;
                min-height: 100% !important;
            }
            
            .cart-product {
                width: 100% !important;
                overflow-y: auto !important;
            }
            
            .xans-order-basketpackage .xans-order-basket, 
            .xans-order-basketpackage .xans-order-totalsummary,
            .xans-order-basketpackage .xans-order-totalorder {
                position: relative !important;
                overflow: visible !important;
            }
            
            .xans-order-totalorder {
                margin-bottom: 50px !important;
            }
            
            /* 모바일 환경에서 특정 요소가 겹치는 문제 해결 */
            @media (max-width: 768px) {
                #contents {
                    min-height: 100% !important;
                    overflow-y: auto !important;
                }
                
                .xans-order-basketpackage {
                    padding-bottom: 50px !important;
                }
                
                .cart-container {
                    display: block !important;
                }
                
                .cart-product {
                    width: 100% !important;
                }
            }
            
            /* 최상단 배너가 스크롤에 영향을 주지 않도록 수정 */
            .main_top_banner {
                position: static !important;
                z-index: auto !important;
            }
        `;
        iframeHead.appendChild(styleTag);
        
        // body 스크롤 활성화
        var body = iframeDoc.body;
        if (body) {
            body.style.overflow = 'auto';
            body.style.height = '100%';
            body.style.position = 'relative';
        }
        
        // 컨테이너 및 컨텐츠 영역 스타일 적용
        var container = iframeDoc.getElementById('container');
        if (container) {
            container.style.overflowY = 'auto';
            container.style.height = '100%';
            container.style.minHeight = '100%';
            container.style.position = 'relative';
        }
        
        var contents = iframeDoc.getElementById('contents');
        if (contents) {
            contents.style.overflowY = 'auto';
            contents.style.height = '100%';
            contents.style.minHeight = '100%';
            contents.style.paddingTop = '0';
            contents.style.position = 'relative';
        }
        
        var wrap = iframeDoc.getElementById('wrap');
        if (wrap) {
            wrap.style.overflowY = 'auto';
            wrap.style.height = '100%';
            wrap.style.minHeight = '100%';
            wrap.style.position = 'relative';
        }
        
        // 최상단 배너 수정
        var mainTopBanner = iframeDoc.querySelector('.main_top_banner');
        if (mainTopBanner) {
            mainTopBanner.style.position = 'static';
            mainTopBanner.style.zIndex = 'auto';
        }
        
        // 장바구니 패키지 영역 스크롤 가능하게
        var basketPackage = iframeDoc.querySelector('.xans-order-basketpackage');
        if (basketPackage) {
            basketPackage.style.overflowY = 'auto';
            basketPackage.style.height = 'auto';
            basketPackage.style.minHeight = '100%';
            basketPackage.style.position = 'relative';
            basketPackage.style.paddingBottom = '50px';
        }
        
        // 카트 컨테이너 및 제품 영역 스크롤 가능하게
        var cartContainer = iframeDoc.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.style.display = 'block';
            cartContainer.style.overflowY = 'auto';
            cartContainer.style.height = 'auto';
            cartContainer.style.minHeight = '100%';
        }
        
        var cartProduct = iframeDoc.querySelector('.cart-product');
        if (cartProduct) {
            cartProduct.style.width = '100%';
            cartProduct.style.overflowY = 'auto';
        }
        
        // 장바구니 패키지 내부 요소들 스타일 적용
        var orderBasket = iframeDoc.querySelector('.xans-order-basket');
        if (orderBasket) {
            orderBasket.style.position = 'relative';
            orderBasket.style.overflow = 'visible';
        }
        
        var totalSummary = iframeDoc.querySelector('.xans-order-totalsummary');
        if (totalSummary) {
            totalSummary.style.position = 'relative';
            totalSummary.style.overflow = 'visible';
        }
        
        var totalOrder = iframeDoc.querySelector('.xans-order-totalorder');
        if (totalOrder) {
            totalOrder.style.position = 'relative';
            totalOrder.style.overflow = 'visible';
            totalOrder.style.marginBottom = '50px';
        }
        
        // 스크롤 이벤트 핸들러 - 배너가 자동으로 닫히는 것 방지
        iframeDoc.addEventListener('scroll', function(e) {
            // 배너 관련 코드가 스크롤 이벤트에서 호출되지 않도록 방지
            var topBanner = iframeDoc.querySelector('.main_top_banner');
            if (topBanner) {
                topBanner.style.position = 'static';
            }
            e.stopPropagation();
        }, true);
        
    } catch (e) {
        console.log('iframe 스타일 적용 중 오류 발생:', e);
    }
}

/**
 * 사이드 장바구니 열기 함수
 */
function openCartSidebar() {
    var overlay = document.querySelector('.cart-sidebar-overlay');
    var sidebar = document.querySelector('.cart-sidebar');
    var iframe = document.getElementById('cartIframe');
    var floatingBtn = document.querySelector('.floating-close-btn');

    // 카트 사이드바와 오버레이 표시
    overlay.style.display = 'block';
    sidebar.style.right = '0';
    sidebar.classList.add('active');
    sidebar.style.display = 'flex';
    
    // 플로팅 닫기 버튼 위치 및 표시
    floatingBtn.style.display = 'flex';
    
    // iframe에 basket.html 로드
    setTimeout(function() {
        iframe.src = '/order/basket.html';
        
        // iframe 로드 이벤트
        iframe.onload = function() {
            applyIframeStyles(iframe);
            
            // 반복적으로 스타일 적용 (비동기 로딩 요소들 처리)
            var styleTimes = [300, 500, 1000, 1500, 2000];
            styleTimes.forEach(function(time) {
                setTimeout(function() {
                    applyIframeStyles(iframe);
                }, time);
            });
            
            // 스크롤 이벤트 감지하여 필요시 스타일 재적용
            try {
                if (iframe.contentDocument) {
                    iframe.contentDocument.addEventListener('scroll', function() {
                        setTimeout(function() {
                            applyIframeStyles(iframe);
                        }, 100);
                    });
                    
                    // 컨텐츠 변경 시 스타일 재적용을 위한 MutationObserver 설정
                    var observer = new MutationObserver(function(mutations) {
                        applyIframeStyles(iframe);
                    });
                    
                    observer.observe(iframe.contentDocument.body, {
                        childList: true,
                        subtree: true
                    });
                }
            } catch (e) {
                console.log('이벤트 리스너 등록 중 오류 발생:', e);
            }
        };
    }, 50);

    // 오버레이 클릭 시 사이드바 닫기
    overlay.addEventListener('click', closeCartSidebar);
}

/**
 * 사이드 장바구니 닫기 함수
 */
function closeCartSidebar() {
    var overlay = document.querySelector('.cart-sidebar-overlay');
    var sidebar = document.querySelector('.cart-sidebar');
    var floatingBtn = document.querySelector('.floating-close-btn');
    
    // 모바일 환경에서는 다른 값 사용
    if (window.innerWidth <= 768) {
        sidebar.style.right = '-90vw';
    } else {
        sidebar.style.right = '-70vw';
    }
    
    overlay.style.display = 'none';
    sidebar.classList.remove('active');
    floatingBtn.style.display = 'none';
    
    // 일정시간 후 완전 숨기기
    setTimeout(function() {
        if (!sidebar.classList.contains('active')) {
            sidebar.style.display = 'none';
        }
    }, 300);
}

// DOM이 로드되면 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 닫기 버튼에 이벤트 리스너 추가
    var closeBtn = document.querySelector('.cart-sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartSidebar);
    }
    
    // 카트 버튼에 이벤트 리스너 추가
    var cartButtons = document.querySelectorAll('.xans-layout-orderbasketcount a, #header .cart a');
    cartButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCartSidebar();
        });
    });
    
    // 사이드 장바구니가 열릴 때 이벤트 처리
    $(document).on('cart:open', function() {
        $('.cart-sidebar').addClass('active').show();
        $('.cart-sidebar-overlay').show();
        $('.floating-close-btn').show();
    });

    // 사이드 장바구니가 닫힐 때 이벤트 처리
    $(document).on('cart:close', function() {
        $('.cart-sidebar').removeClass('active').hide();
        $('.cart-sidebar-overlay').hide();
        $('.floating-close-btn').hide();
    });
});
