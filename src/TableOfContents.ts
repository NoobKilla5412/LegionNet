import { createElement } from "./utils";

function createIDFromText(text: string) {
  return text.replace(/\s+/g, "-").toLowerCase();
}

export function createTableOfContents<K extends keyof HTMLElementTagNameMap>(tag: K) {
  let elements = document.body.getElementsByTagName(tag);
  if (elements.length == 0) return;
  let table = createElement("div", { className: "container border", style: { borderRadius: ".5rem" } });
  let headers = Array.from(document.body.getElementsByTagName(tag));
  headers.forEach((element) => {
    table.appendChild(createElement("a", { href: `#${createIDFromText(element.innerText)}`, innerText: `${element.innerText}` }));
    table.appendChild(createElement("br"));
    element.id = createIDFromText(element.innerText);
  });
  document.body.insertBefore(table, document.body.firstElementChild?.nextSibling!);
}
