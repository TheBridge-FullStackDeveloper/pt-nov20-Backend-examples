const backUrl = "https://localhost:8080";

const loginButton = document.querySelector("#login");

loginButton.addEventListener("click", () => {
    fetch(`${backUrl}/login/github`, {
        credentials: "include"
    }).then(response => response.json()).then(data => {
        const {url} = data;
        localStorage.setItem("loginGitHub", true);
        window.location.href = url;

    });
});

if (localStorage.getItem("loginGitHub") === "true") {

    fetch(`${backUrl}/githubOauth${window.location.search}`, {
        credentials: "include"
    }).then(res => res.json()).then(data => console.log(data));
    localStorage.clear("loginGitHub");
}