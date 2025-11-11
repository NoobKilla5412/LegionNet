"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const console_1 = require("console");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_limit_1 = require("express-limit");
const fs_1 = require("fs");
const https_1 = __importDefault(require("https"));
const logger_1 = require("logger");
const mime_1 = __importDefault(require("mime"));
const socket_io_1 = require("socket.io");
const url_1 = require("url");
const TOP_LEVEL_DIR = __dirname + "/../";
try {
    function isUrl(val = "") {
        if (/^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " "))
            return true;
        return false;
    }
    let online = [];
    const blockedSites = (0, fs_1.readFileSync)(TOP_LEVEL_DIR + "blockedSites.csv")
        .toString()
        .split(/\n/)
        .map((v) => v.trim().toLowerCase());
    function isBlocked(url) {
        for (const site of blockedSites) {
            if (url.toLowerCase().includes(site))
                return site;
        }
        return null;
    }
    const logger = (0, logger_1.createLogger)("history.log");
    (async () => {
        const { default: fetch } = await eval(`import("node-fetch")`);
        const app = (0, express_1.default)();
        const server = https_1.default.createServer(app);
        const io = new socket_io_1.Server(server);
        const port = 8081;
        io.on("connection", (socket) => {
            let name = "";
            socket.on("user", (user) => {
                name = user;
                console.log(`user ${name} connected`);
            });
            socket.on("disconnect", () => {
                console.log(`user ${name} disconnected`);
            });
        });
        app.use((req, res, next) => {
            const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
            if (!validMethods.includes(req.method)) {
                return res.status(405).send("Method Not Allowed");
            }
            next();
            return;
        });
        app.use((0, cookie_parser_1.default)());
        app.get("/overlay", (req, res) => {
            try {
                res.send((0, fs_1.readFileSync)(TOP_LEVEL_DIR + "overlay.html").toString());
            }
            catch (e) {
                console.error(e);
                logger.error(e);
                res.send("Error");
            }
        });
        app.get("/bin/index.js", (req, res) => {
            try {
                res.contentType(mime_1.default.lookup("js"));
                res.send((0, fs_1.readFileSync)(TOP_LEVEL_DIR + "bin/index.js").toString());
            }
            catch (e) {
                console.error(e);
                logger.error(e);
                res.send("Error");
            }
        });
        app.get("/", (0, express_limit_1.limit)({
            max: 50,
            period: 1000
        }), async (req, res) => {
            let user = undefined;
            try {
                function sendError(e) {
                    logger.error("User: " + user, e);
                    res.send((0, fs_1.readFileSync)(TOP_LEVEL_DIR + "overlay.html")
                        .toString()
                        .replace(/\$value/, "") + `<h1>${e}</h1>`);
                }
                let url = req.query.url;
                user = "user" in req.query ? req.query.user?.toString() : undefined;
                let cookies = req.cookies;
                const host = req.get("host");
                const searchParam = "q";
                const searchEngine = "https://google.com/search?q=";
                const protocol = req.protocol;
                if (typeof url != "string") {
                    res.send((0, fs_1.readFileSync)(TOP_LEVEL_DIR + "overlay.html")
                        .toString()
                        .replace(/\$value/, ""));
                    return;
                }
                if (!user) {
                    sendError("A user is required");
                    return;
                }
                if (!url || isBlocked(url)) {
                    res.send((0, fs_1.readFileSync)(TOP_LEVEL_DIR + "overlay.html")
                        .toString()
                        .replace(/\$value/, ""));
                    if (url) {
                        logger.error("User: " + user, "Blocked site: " + url);
                        console.log("User: " + user, "Blocked site", url);
                        console.log(isBlocked(url));
                    }
                    return;
                }
                if (url.startsWith("https://google.com/url?q=")) {
                    res.redirect(`${protocol}://${host}/?url=${encodeURIComponent(url.substring("https://google.com/url?q=".length))}`);
                    return;
                }
                if (!isUrl(url)) {
                    url = searchEngine + encodeURIComponent(url);
                }
                if (isUrl(url)) {
                    if (!/^https?:\/\//.test(url))
                        url = "https://" + url;
                    let overlay = (0, fs_1.readFileSync)(TOP_LEVEL_DIR + "overlay.html")
                        .toString()
                        .replace(/\$value/, (new RegExp(`^${searchEngine.replace(/\//g, "\\/").replace(/\?/g, "\\?")}`).test(url)
                        ? new url_1.URL(url).searchParams.get(searchParam) || ""
                        : url || "").replace(/"/g, '\\"'));
                    if (new RegExp("^https:\\/\\/" + host + "\\/").test(url)) {
                        res.send(overlay + "The page you requested was already proxied");
                        return;
                    }
                    if (user != undefined) {
                        logger.info("User: " + user, "loaded url", url);
                        console.log("User: " + user, "loaded url", url);
                    }
                    let response;
                    try {
                        let cookiesList = "";
                        for (const key in cookies) {
                            if (Object.prototype.hasOwnProperty.call(cookies, key)) {
                                const value = cookies[key];
                                cookiesList += `${key}=${value};`;
                            }
                        }
                        (0, console_1.log)(cookiesList);
                        response = await fetch(url + "", {
                            headers: {
                                cookies: cookiesList
                            }
                        });
                    }
                    catch (e) {
                        res.send(`${overlay}This site can’t be reached<br>Check if there is a typo in ${url}`);
                        logger.error("User: " + user, e);
                        return;
                    }
                    let type = response.headers.get("Content-Type");
                    if (type != null) {
                        const body = await response.text();
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        if (type.includes("html")) {
                            res.send(overlay +
                                body.replace(/(href|src)="([^"]*)"/g, (text, type, page) => {
                                    if (typeof page != "string") {
                                        console.error(`Invalid URL: "${page}"`);
                                        return "";
                                    }
                                    if (page.startsWith("/")) {
                                        if (url == null) {
                                            sendError(`URL is null`);
                                            return "";
                                        }
                                        const _url = new url_1.URL(url);
                                        page = _url.protocol + "//" + _url.host + page;
                                    }
                                    console.log(`URL: ${type}=${protocol}://${host}/?url=${encodeURI(page)}&user=${user}`);
                                    return `${type}=${protocol}://${host}/?url=${encodeURI(page)}&user=${user}`;
                                }));
                        }
                        else {
                            res.setHeader("Content-Type", type);
                            res.send(body);
                        }
                    }
                }
                else {
                    sendError(`URL "${url}" is not valid`);
                }
            }
            catch (e) {
                console.error(e);
                logger.error("User: " + user, e.toString());
                res.send("Error");
            }
        });
        try {
            server.listen(port, () => {
                console.log(`listening on port ${port}`);
            });
        }
        catch (e) {
            console.log(e);
        }
    })();
}
catch (e) {
    console.log(e);
}
