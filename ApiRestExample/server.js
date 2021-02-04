/*
====================================
	Imports
====================================
*/
const express = require("express");
const typeValidator = require("./lib/typeValidator");
const { v4: uuid } = require('uuid');


/*
====================================
	Settings
====================================
*/
const server = express();
const port = 8080;

server.use(express.json());


/*
====================================
	Data
====================================
*/
/*
	Users
		id: {
				name: string,
				surname: string,
				birthday: number,
				email: string,
				password: string
			}

	Articles
		id: {
				title: string,
				body: string,
				author: string
			}

*/
let users = {};
let articles = {};

/*
====================================
	Endpoins
====================================
*/

// Users

// ? Create user
server.post("/user", (req, res) => {
	const {name, surname, birthday, email, password} = req.body;
	if (typeValidator.isString(name) && typeValidator.isString(surname) && typeValidator.isNumber(birthday) && typeValidator.isString(email) && typeValidator.isString(password)) {
		const id = uuid();
		users[id] = {
			name,
			surname,
			birthday,
			email,
			password
		}
		res.send({"msg": `The user ${id} was created`, id});
	}
	else {
		res.send({"error": "One of the parameters is invalid"});
	}
});

// ? Delete User
server.delete("/user/:id", (req, res) => {
	const {id} = req.params;

	let {[id]: deletedUser, ...allUsers} = users;
	users = allUsers;
	res.send({"msg": `User ${id} deleted`});
});

// ? Modify User
server.put("/user/:id", (req, res) => {
	const {id} = req.params;
	const user = users[id];
	if (user) {
		let {name = user.name, surname = user.surname, birthday = user.birthday, email = user.email, password = user.password} = req.body;
		if (typeValidator.isString(name) && typeValidator.isString(surname) && typeValidator.isNumber(birthday) && typeValidator.isString(email) && typeValidator.isString(password)) {
			users[id] = {
				name,
				surname,
				birthday,
				email,
				password
			}
			res.send({"msg": "User modified"});
		}
		else {
			res.send({"error": "One of the parameters is invalid"});
		}
	}
	else {
		res.send({"error": "Invalid userId"});
	}
});

server.patch("/user/:id", (req, res) => {
	const {id} = req.params;
	const {name, surname, birthday, email, password} = req.body;
	if (typeValidator.isString(name) && typeValidator.isString(surname) && typeValidator.isNumber(birthday) && typeValidator.isString(email) && typeValidator.isString(password)) {
		users[id] = {
			name,
			surname,
			birthday,
			email,
			password
		}
		res.send({"msg": `The user ${id}`, id});
	}
	else {
		res.send({"error": "One of the parameters is invalid"});
	}
});

// ? Get User Info
server.get("/user", (req, res) => {
	const {id} = req.query;
	if (id && users[id])
		res.send({"user": users[id]});
	else
		res.send({"error": "Invalid userId"});
});



// Articles

// ? Create Article
server.post("/article", (req, res) => {
	const {title, body, author} = req.body;
	if (typeValidator.isString(title) && typeValidator.isString(body) && users[author]) {
		const id = uuid();
		articles[id] = {
			title,
			body,
			author
		}
		res.send({"msg": `The article ${id} was created`, id});
	}
	else {
		res.send({"error": "One of the parameters is invalid"});
	}
});

// ? Delete Article
server.delete("/article/:id", (req, res) => {
	const {id} = req.params;

	let {[id]: deletedArticle, ...allArticles} = articles;
	articles = allArticles;
	res.send({"msg": `Article ${id} deleted`});
});

// ? Modify Article
server.put("/article/:id", (req, res) => {
	const {id} = req.params;
	const article = articles[id];
	if (article) {
		let {title = article.title, body = article.body, author = article.author} = req.body;
		if (typeValidator.isString(title) && typeValidator.isString(body) && users[author]) {
			articles[id] = {
				title,
				body,
				author
			}
			res.send({"msg": `The article ${id} was modified`, id});
		}
		else {
			res.send({"error": "One of the parameters is invalid"});
		}
	}
	else {
		res.send({"error": "Invalid userId"});
	}
});

server.patch("/user/:id", (req, res) => {
	const {id} = req.params;
	const {title, body, author} = req.body;
	if (typeValidator.isString(title) && typeValidator.isString(body) && users[author]) {
		articles[id] = {
			title,
			body,
			author
		}
		res.send({"msg": `The article ${id} was modified`, id});
	}
	else {
		res.send({"error": "One of the parameters is invalid"});
	}
});

// ? Get Article Info
server.get("/article", (req, res) => {
	const {id} = req.query;
	if (id && articles[id])
		res.send({"article": articles[id]});
	else
		res.send({"error": "Invalid articleId"});
});
/*
====================================
	Listen to port
====================================
*/
server.listen(port, () => {
	console.log(`Listening on url: http://localhost:${port}`);
});