import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createElement } from "./utils";

const parser = new DOMParser();

let currentPage = window.location.hash;

function create(url: string) {
  let win = window.open();
  if (!win) return;
  win.document.body.style.margin = "0";
  win.document.body.style.height = "100vh";
  let iframe = win.document.createElement("iframe");
  iframe.style.border = "none";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.margin = "0";
  iframe.src = url;

  win.document.body.appendChild(iframe);
}

async function navigateTo(page: string) {
  let elements = document.body.getElementsByClassName("container-fluid");
  elements[elements.length - 1].remove();
  document.body.appendChild(parser.parseFromString(await (await fetch(`/${page}.html`)).text(), "text/html").body.firstElementChild!);
}

(async () => {
  if (location.pathname == "/launch") {
    let url = new URL(location.href);
    url.pathname = "/";
    document.body
      .appendChild(createElement("button", { type: "button", className: "btn btn-primary", innerText: "Open in new window" }))
      .addEventListener("click", () => {
        let pwd = prompt("Enter the password");
        if (pwd == "SDIYBT") create(url.href);
        else if (pwd) open("/tabBomb");
      });
    return;
  }

  const header = await (await fetch("/header.html")).text();
  document.body.prepend(parser.parseFromString(header, "text/html").body.firstElementChild!);

  setInterval(() => {
    let lastPage = currentPage;
    currentPage = window.location.hash;

    if (currentPage != "") currentPage = currentPage.substring(1);
    else currentPage = "index";
    if (lastPage != currentPage) navigateTo(currentPage);
  }, 100);

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

  let file = window.location.pathname;
  if (file != "/") file = file.substring(1);

  document.getElementById(file)?.classList.add("active");
})();
