// app.js

const discountApp = (function () {
    'use strict';

    // 운영 환경에 맞게 수정해야 할 URL과 Client ID
    const discountUrl = "https://marmnt.vercel.app/api/discount-apply"; //<--- 운영 환경에 맞게 수정
    const clientId = "u4sbsHNgB1mjuxeoBMm2EA"; //<--- 운영 환경에 맞게 수정

    return {
        applyDiscount: function (params) { // 할인 로직 호출
            const discountRequest = {
                mall_id: params.ec_mall_id,
                shop_no: params.shop_no,
                member_id: params.member_id,
                guest_key: params.guest_key,
                member_group_no: params.group_no,
                product: params.products,
                time: Math.ceil(Date.now() / 1000)
            };

            $.ajax({
                url: discountUrl,
                type: 'POST',
                cache: false,
                data: JSON.stringify(discountRequest),
                contentType: 'application/json',
                success: function (response) {
                    console.log('Discount applied successfully:', response);
                },
                error: function (error) {
                    console.error('Error applying discount:', error);
                }
            });
        },

        initDiscount: function () { // 장바구니 및 기본 정보 세팅
            const discountParams = {};

            // 장바구니 상품 개수 가져오기
            fetch(`https://marmnt.cafe24api.com/api/v2/admin/customers/${discountParams.member_id}/cart`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.CAFE24_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(cartData => {
                const itemCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
                discountParams.products = cartData.items.map(item => ({ product_no: item.product_no, quantity: item.quantity }));

                // 할인율 가져오기
                return fetch('https://marmnt.vercel.app/api/discount-rules');
            })
            .then(response => response.json())
            .then(discountRules => {
                let discountRate = 0;
                discountRules.forEach(rule => {
                    if (itemCount >= rule.itemCount) {
                        discountRate = rule.discountRate;
                    }
                });

                discountParams.discount_rate = discountRate;

                // 할인 적용
                this.applyDiscount(discountParams);
            })
            .catch(error => {
                console.error('Error initializing discount:', error);
            });
        }
    };
})();

// 초기화 함수 호출
discountApp.initDiscount();

// DOM 로드 이후 실행
if (document.readyState === 'complete') {
    $("body").on("EC_ORDER_ORDERFORM_CHANGE", function (e, oParam) {
        if (oParam.event_type !== 'product_change') {
            return;
        }
        discountApp.initDiscount();
    });

    discountApp.initDiscount();
} else {
    window.addEventListener('load', discountApp.initDiscount);
}
