import { createDarkHeartButton } from "./DarkHeart";
import { RecursivePartial } from "./types";

export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, properties?: RecursivePartial<HTMLElementTagNameMap[K]>) {
  const element = document.createElement(tag);
  if (properties) {
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        const property = properties[key];
        element[key] = property as any;
      }
    }
  }
  return element;
}

export async function navigateTo(page: string) {
  let elements = document.body.getElementsByClassName("container-fluid");
  elements[elements.length - 1].remove();
  document.body.appendChild(parser.parseFromString(await (await fetch(`/${page}.html`)).text(), "text/html").body.firstElementChild!);
  if (location.hash == "#DarkHeart") {
    createDarkHeartButton();
  }
}

export function createObfuscatedWindow(url: string) {
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

export const parser = new DOMParser();

export const password = "SDIYBT";
