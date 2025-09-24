import { createDarkHeartButton } from "./DarkHeart";
import { createTableOfContents } from "./TableOfContents";
import { RecursivePartial } from "./types";

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  properties?: RecursivePartial<HTMLElementTagNameMap[K]>,
  customProperties?: { [key: string]: string }
) {
  const element = document.createElement(tag);
  if (properties) {
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        const property = properties[key];

        if (typeof property == "object" && property) {
          for (const key1 in property) {
            if (Object.prototype.hasOwnProperty.call(property, key1)) {
              const element1 = property[key1];
              //@ts-ignore
              element[key][key1] = element1 as any;
            }
          }
          //@ts-ignore
        } else element[key] = property as any;
      }
    }
  }
  if (customProperties) {
    for (const key in customProperties) {
      if (Object.prototype.hasOwnProperty.call(customProperties, key)) {
        const property = customProperties[key];
        element.setAttribute(key, property);
      }
    }
  }
  return element;
}

export async function navigateTo(page: string) {
  let elements = document.body.getElementsByClassName("container-fluid");
  elements[elements.length - 1].remove();
  document.body.appendChild(parser.parseFromString(await (await fetch(`/${page}.html`)).text(), "text/html").body.firstElementChild!);
  onLoad(page);
}

export function onLoad(page: string) {
  if (page.startsWith("/")) page = page.substring(1);

  switch (page) {
    case "DarkHeart":
      createDarkHeartButton();
      break;
    case "ProxyCompanyListings":
      createTableOfContents("h3");
      break;
    case "GamesAndProxies":
      createTableOfContents("h3");
      break;
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

export const password = "67mustardmangolabubu";