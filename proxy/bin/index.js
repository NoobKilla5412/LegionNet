"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)();
let user = localStorage.getItem("user") || "";
const signInButton = document.getElementById("sign-in");
const userNameField = document.getElementById("user");
const form = document.getElementById("enter-url");
const urlInput = document.getElementById("url");
if (user)
    signInButton.style.display = "none";
signInButton.addEventListener("click", () => {
    let input = "";
    while (!input)
        input = prompt("Enter your name") || "";
    user = input;
    localStorage.setItem("user", user);
});
urlInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter")
        form.submit();
});
while (!user)
    user = prompt("Enter your name") || "";
localStorage.setItem("user", user);
let url = new URL(location.href);
if (!url.searchParams.get("user")) {
    url.searchParams.set("user", user);
    location.search = url.search;
}
socket.emit("user", user);
setInterval(() => {
    document.title = "Google";
    userNameField.value = user;
});
