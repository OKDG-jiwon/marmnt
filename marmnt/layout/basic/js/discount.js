// CAFE24API 초기화
(function(CAFE24API) {
  // CAFE24API 객체를 통해 SDK 메소드를 사용할 수 있습니다.
  })(CAFE24API.init({
    client_id: 'u4sbsHNgB1mjuxeoBMm2EA',  // 사용할 앱의 App Key를 설정해 주세요.
    version: '2022-12-01'  // 적용할 버전을 설정해 주세요.
}));

// 장바구니 정보 조회
function fetchCartList() {
  CAFE24API.getCartList(function(err, res) {
    if (err) {
      // 오류 발생 시 처리
      console.error('장바구니 정보 조회 중 오류 발생:', err.name, err.message);
      console.error('상세 오류 메시지:', res.error.message);
    } else {
      // 성공 시 장바구니 정보 처리
      console.log('장바구니 정보:', res.carts);
      // 장바구니 정보를 서버로 전송
      sendCartInfoToServer(res.carts);
    }
  });
}

// 서버로 장바구니 정보 전송
function sendCartInfoToServer(cartData) {
  fetch('/api/applyDiscount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cartData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('서버 응답:', data);
    console.log('서버에서 받은 장바구니 정보:', data.cartData);
  })
  .catch(error => {
    console.error('서버로 전송 중 오류 발생:', error);
  });
}

// 페이지 로드 시 장바구니 정보 조회
window.onload = function() {
  fetchCartList();
};