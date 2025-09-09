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

export const password = "SDIYBT";
