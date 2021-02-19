const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const JWT = require("jwt-simple");

const PORT = 8080;
const SECRET = "Hola Mundo";
const server = express();

const users = {};

const excludedPaths = ["/user POST", "/login POST"];

server.use(express.json());
server.use(cors());
server.use(cookieParser());



function hashString(string, secret = SECRET) {
    const hashedString = crypto.createHmac("sha256", secret).update(string).digest("hex");
    return hashedString;
}

function saltPepperPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    let hash = hashString(hashString(password), salt);

    return {password: hash, salt};
}

function verifyPassword(password, originalPassword) {
    const hashedPassword = saltPepperPassword(password, originalPassword.salt);
    console.log(hashedPassword, originalPassword.password);
    return hashedPassword.password === originalPassword.password;
}
/*
    1.- Guardar la contraseña tal cual
    2.- Codificar
    3.- Encryptación Hash
    4.- Hash + salt
    5.- Hash + Salt + Pepper

    123 + h35t98h23487tc2fh34098hf572398h057459806t5yf389v5ygtg09823vhy45vt0923vgy4tv809 + asjdfkldfkljfklasdjflasdjflkasdf9wr239bryc32984tyc
    abcd45

    123 + asdff8syg8fgfsd6h98ghy6fg8767s8d9f6g89dfs6g789sd6h89d6gdf9g87fd6g789df6gd897g + asjdfkldfkljfklasdjflasdjflkasdf9wr239bryc32984tyc

    dea654


*/

function checkPath(pathname, method) {
    const endpoint = `${pathname} ${method}`;
    return excludedPaths.includes(endpoint);
}

server.use((req, res, next) => {
    if (!checkPath(req.path, req.method)) {
        const {jwt} = req.cookies;
        let payload;
        try {
            if (jwt) {
                payload = JWT.decode(jwt, SECRET);
                if (payload) {
                    req.user = payload;
                    next();
                }  else {
                    throw "No valid JWT";
                }
            }
            else {
                throw "No payload";
            }
        } catch(e) {
            res.status(403).send({error: "You must be logged in"});
        }
    }
    else {
        next();
    }
});


server.post("/user", (req, res) => {
    const {username, password} = req.body;
    if (username && password) {
        // Register the user
        users[username] = {
            username,
            password: saltPepperPassword(password)
        }
        res.cookie("name", "Miguel").send({msg: "Hola Mundo"});
    }
    else {
        res.send({"error": "A username and password must be provided"});
    }
});
server.get("/login", (req, res) => {
    const {username, password} = req.body;
    if (username && password) {
        const user = users[username];
        if (user) {
            if (verifyPassword(password, user.password)) {
                res.cookie("jwt", JWT.encode({
                    "iat": new Date(),
                    "sub": username
                }, SECRET), {httpOnly: true});
                res.send({"msg": "You have logged in!"});
            } else {
                res.send({"error": "Wrong password"});
            }
        } else {
            res.send({"error": "No such username"});
        }
    } else {
        res.send({"error": "A username and password must be provided"});
    }
});

server.get("/user", (req, res) => {
    res.send({"msg": "You are logged in", "data": req.user});
});

server.get("/logout", (req, res) => {
    res.clearCookie("jwt").send({"msg": "cookie deleted"});
})

server.listen(PORT, () => console.log(`Escuchando por http://localhost:${PORT}`));