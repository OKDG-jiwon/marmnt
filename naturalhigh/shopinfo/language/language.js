document.addEventListener("DOMContentLoaded", function () {
    const languageToggle = document.getElementById("languageToggle");
    const loginText = document.getElementById("loginText");
    const logoutText = document.getElementById("logoutText");

    // 기본 언어 상태 설정 (로컬 스토리지에 저장)
    let language = localStorage.getItem("language") || "Int";

    function updateLanguage(lang) {
        if (lang === "Int") {
            // 영어로 변경
            loginText.textContent = "Login";
            loginText.href = "/member/login.html";
            logoutText.textContent = "Logout";
            logoutText.href = "/member/logout.html";
            languageToggle.textContent = "Int";
        } else {
            // 한국어로 변경
            loginText.textContent = "로그인";
            loginText.href = "/member/login.html";
            logoutText.textContent = "로그아웃";
            logoutText.href = "/member/logout.html";
            languageToggle.textContent = "Kor";
        }
    }

    // 초기 상태 업데이트
    updateLanguage(language);

    // 언어 토글 클릭 이벤트
    languageToggle.addEventListener("click", function (e) {
        e.preventDefault();
        language = language === "Int" ? "Kor" : "Int";
        localStorage.setItem("language", language); // 상태 저장
        updateLanguage(language);
    });
});
