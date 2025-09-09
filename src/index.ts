import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createElement } from "./utils";

const parser = new DOMParser();

(async () => {
  const header = await (await fetch("/header.html")).text();
  document.body.prepend(parser.parseFromString(header, "text/html").body.firstElementChild!);

  // Add favicon to all pages
  document.head.appendChild(
    createElement("link", {
      rel: "icon",
      href: "favicon.ico",
      type: "image/x-icon"
    })
  );
  document.head.appendChild(
    createElement("link", {
      rel: "shortcut icon",
      href: "favicon.png",
      type: "image/png"
    })
  );

  let file = window.location.pathname;
  if (file != "/") file = file.substring(1);

  document.getElementById(file)?.classList.add("active");
})();
