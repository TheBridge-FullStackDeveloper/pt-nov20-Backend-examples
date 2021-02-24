const express = require("express");
const fetch = require("node-fetch");
const JWT = require("jwt-simple");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");

// Import .env configuration
require("dotenv").config({path: __dirname + "/.env"});

// Use the GitHub OAuth Credentials
const GH_SECRET = process.env.GH_SECRET;
const GH_CLIENT = process.env.GH_CLIENT;
const SECRET = process.env.SECRET;

// Set the express config
const PORT = process.env.PORT || 8080;
const server = express();

const httpsServer = https.createServer({
    cert: fs.readFileSync(__dirname + "/cert/ssl.cert"),
    key: fs.readFileSync(__dirname + "/cert/ssl.key")
}, server);

// Middlewares
server.use(cors({
    origin: ["http://127.0.0.1:5500"],
    credentials: true
}));
server.use(cookieParser());

// Redirect user to github login
server.get("/login/github", (req, res) => {
    res.send({"url": `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT}&scope=user%20user:email`});
});

// Receive code from GitHub OAuth
server.get("/githubOauth", (req, res) => {
    console.log("cookies:", req.cookies);
    const {code, error, error_description, error_uri} = req.query;
    // If the user accepted the login
    if (code) {
        // Ask GitHub for an access token
        fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "client_id": GH_CLIENT,
                "client_secret": GH_SECRET,
                code
            })
        }).then(res => res.json()).then(data => {
            // console.log("Access Token Data:", data);
            const {access_token: accessToken, token_type: tokenType} = data;
            // If an access token was given
            if (accessToken) {
                const Token = `${tokenType} ${accessToken}`;
                // Ask GitHub for email and for user details
                fetch("https://api.github.com/user", {
                    headers: {
                        "Authorization": Token,
                        "Accept": "application/vnd.github.v3+json"
                    }
                }).then(res => res.json()).then(data => {
                    // console.log("User Data:", data);
                    const jwt = JWT.encode({
                        username: data.login,
                        id: data.id
                    }, SECRET);
                    res.cookie("jwt", jwt, {httpOnly: true, sameSite: "none", secure: true}).send({"msg": "ok"});
                    // Here should be the JWT generation
                }).catch(e => console.log(e));

            // If the access token was not generated
            } else {
                res.send({"msg": "error"});
            }
        }).catch(e => console.log(e));
    // If a code was not provided
    } else {
        // If it is because the user declined the login
        if (error === "access_denied")
            res.send({"msg": "error, you have declined the login"});
        else
            res.send({"msg": "Unknown error"});
    }
})

httpsServer.listen(PORT, () => console.log(`Listening on https://localhost:${PORT}`));