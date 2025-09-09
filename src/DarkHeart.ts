import { createElement } from "./utils";

export function createDarkHeartButton() {
  let elements = document.body.getElementsByClassName("container-fluid");

  let button = createElement("button", {
    innerText: "Open DarkHeart Proxy",
    className: "btn btn-primary",
    onclick: () => {
      document.body.innerHTML = "";
      document.body.style.margin = "0";
      document.body.style.height = "100vh";
      let frame = createElement("iframe", {
        src: "https://hello.com"
      });
      frame.style.border = "none";
      frame.style.width = "100%";
      frame.style.height = "100%";
      frame.style.margin = "0";
      document.body.appendChild(frame);
    }
  });

  elements[elements.length - 1].appendChild(button);
}
