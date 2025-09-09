import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const parser = new DOMParser();

(async () => {
  const header = await (await fetch("/header.html")).text();
  document.body.prepend(parser.parseFromString(header, "text/html").body.firstElementChild!);

  let file = window.location.pathname;
  if (file != "/") file = file.substring(1);
  console.log(file);
  console.log(document.getElementById(file));

  document.getElementById(file)?.classList.add("active");
})();
