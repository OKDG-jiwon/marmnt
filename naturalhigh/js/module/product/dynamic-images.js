document.addEventListener("DOMContentLoaded", function () {
    // 현재 URL 가져오기 (소문자로 변환)
    const currentPath = window.location.pathname.toLowerCase();
    console.log("Current Path:", currentPath); // URL 경로 출력

    // 각 이미지 요소 선택
    const image1 = document.querySelector("#image1 img");
    const image2 = document.querySelector("#image2 img");
    const image3 = document.querySelector("#image3 img");
    const image4 = document.querySelector("#image4 img");
    
    console.log("Image Elements:", image1, image2, image3, image4); // 이미지 요소 확인

    // 이미지 요소가 존재하는 경우에만 실행
    if (image1 && image2 && image3 && image4) {
        // 조건에 따라 각 이미지 변경
        if (currentPath.includes("/product/celestial-sin-blue-faux-leather-jacket")) {
            image1.src = "/web/gallery/blue1.png";
            image1.alt = "blue-faux-leather-jacket-1";

            image2.src = "/web/gallery/blue2.png";
            image2.alt = "blue-faux-leather-jacket-2";

            image3.src = "/web/gallery/blue3.png";
            image3.alt = "blue-faux-leather-jacket-3";

            image4.src = "/web/gallery/blue4.png";
            image4.alt = "blue-faux-leather-jacket-4";

        } else if (currentPath.includes("/product/celestial-sin-gray-faux-leather-jacket")) {
            image1.src = "/web/gallery/grey1.png";
            image1.alt = "grey-faux-leather-jacket-1";

            image2.src = "/web/gallery/grey2.png";
            image2.alt = "grey-faux-leather-jacket-2";

            image3.src = "/web/gallery/grey3.png";
            image3.alt = "grey-faux-leather-jacket-3";

            image4.src = "/web/gallery/grey4.png";
            image4.alt = "grey-faux-leather-jacket-4";
        }
    } else {
        console.error("One or more image elements were not found.");
    }
});
