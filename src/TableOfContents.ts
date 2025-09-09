import { createElement } from "./utils";

function createIDFromText(text: string) {
  return text.replace(/\s+/g, "-").toLowerCase();
}

export function createTableOfContents<K extends keyof HTMLElementTagNameMap>(tag: K) {
  let elements = document.body.getElementsByTagName(tag);
  if (elements.length == 0) return;
  let tableContainer = createElement("div", { className: "container-fluid" });

  let table = createElement("div", { className: "collapse container border", style: { borderRadius: ".5rem", width: "auto" }, id: "table-of-contents" });
  let expandButton = createElement(
    "button",
    {
      className: "btn btn-outline-dark",
      type: "button",
      ariaExpanded: "false",
      ariaLabel: "Toggle navigation"
    },
    {
      "data-bs-toggle": "collapse",
      "data-bs-target": "#table-of-contents",
      "aria-controls": "table-of-contents"
    }
  );
  expandButton.appendChild(createElement("span", { innerText: "Table of Contents" }));
  tableContainer.appendChild(expandButton);

  let headers = Array.from(document.body.getElementsByTagName(tag));
  headers.forEach((element) => {
    table.appendChild(createElement("a", { href: `#${createIDFromText(element.innerText)}`, innerText: `${element.innerText}` }));
    table.appendChild(createElement("br"));
    element.id = createIDFromText(element.innerText);
  });
  tableContainer.appendChild(table);

  document.body.insertBefore(tableContainer, document.body.firstElementChild?.nextSibling!);
}
