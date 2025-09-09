import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createElement, createObfuscatedWindow, navigateTo, parser, password } from "./utils";

let currentPage = window.location.hash;

(async () => {
  if (location.pathname == "/launch") {
    let url = new URL(location.href);
    url.pathname = "/";
    document.body
      .appendChild(createElement("button", { type: "button", className: "btn btn-primary", innerText: "Open in new window" }))
      .addEventListener("click", () => {
        let pwd = sessionStorage.getItem("pwd") || prompt("Enter the password");
        if (pwd == password) {
          sessionStorage.setItem("pwd", password);
          createObfuscatedWindow(url.href);
        } else if (pwd) open("/tabBomb");
      });
    return;
  }

  // fetch and add header
  const header = await (await fetch("/header.html")).text();
  document.body.prepend(parser.parseFromString(header, "text/html").body.firstElementChild!);

  const navigationInterval = async () => {
    let lastPage = currentPage;
    currentPage = window.location.hash;

    if (currentPage != "") currentPage = currentPage.substring(1);
    else currentPage = "index";
    if (lastPage != currentPage) await navigateTo(currentPage);
  };

  await navigationInterval();

  setInterval(navigationInterval, 100);

  // Add favicon to all pages
  document.head.appendChild(
    createElement("link", {
      rel: "icon",
      href: "/favicon.ico",
      type: "image/x-icon"
    })
  );
  document.head.appendChild(
    createElement("link", {
      rel: "shortcut icon",
      href: "/favicon.png",
      type: "image/png"
    })
  );

  // Set active page in navbar
  let file = window.location.pathname;
  if (file != "/") file = file.substring(1);

  document.getElementById(file)?.classList.add("active");
})();
