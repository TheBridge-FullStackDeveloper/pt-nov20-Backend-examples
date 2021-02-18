const express = require("express");
const base64 = require("base-64");
const crypto = require("crypto");

const server = express();
const PORT = 8080;
// const SECRET = crypto.randomBytes(32).toString("hex");
const SECRET = "a71055aead06d48b1ac125ce02f49a73";
console.log(SECRET);

// Hashing SHA256
function hashString(string) {
    const hashedString = parseBase64ToURL(crypto.createHmac("sha256", SECRET).update(string).digest("base64"));
    return hashedString;
}

// Base 64 url
function parseBase64ToURL(base64String) {
    const parsedString = base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_").toString("base64");
    return parsedString;
}
function encodeBase64(string) {
    const encondedString = base64.encode(string);
    // + => -
    // / => _
    // = =>
    const base64String = parseBase64ToURL(encondedString);

    return base64String;
}

function decodeBase64(base64String) {
    const decodedString = base64.decode(base64String);

    return decodedString;
}
// JWT functions

function generateJWT(payload) {
    const Header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    const encodedHeader = encodeBase64(JSON.stringify(Header));
    const encodedPayload = encodeBase64(JSON.stringify(payload));
    const signature = parseBase64ToURL(hashString(`${encodedHeader}.${encodedPayload}`));

    const JWT = `${encodedHeader}.${encodedPayload}.${signature}`;
    return JWT;
}

function verifyJWT(jwt) {
    const [Header, Payload, Signature] = jwt.split(".");

    const expectedSignature = encodeBase64(hashString(`${Header}.${Payload}`));

    if (Signature === expectedSignature)
        return JSON.parse(decodeBase64(Payload));
    return null;
}


server.get("/", (req, res) => {
    const JWT = generateJWT({
        username: "Miguel"
    });
    console.log(verifyJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pZ3VlbCDDgW5nZWwifQ.Z2tuSzBJU1ZEeW1KbEFmbDI0YmE1dTdQbWdpbjcyY0dKWFpGM2c0cnVVST0"));
    res.send({JWT});
});


server.listen(PORT, () => console.log("http://localhost:" + PORT));