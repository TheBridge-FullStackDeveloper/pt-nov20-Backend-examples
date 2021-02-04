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
	id: {
			name: string,
			surname: string,
			birthday: number,
			email: string,
			password: string
		}
*/
let users = {};

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
		res.send({"msg": `The user ${id}`, id});
	}
	else {
		res.send({"error": "One of the parameters is invalid"});
	}
});

// ? Delete User
server.delete("/user/:id", (req, res) => {
	const {id} = req.params;

	// ! ASí NOOOO!!!
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
/*
====================================
	Listen to port
====================================
*/
server.listen(port, () => {
	console.log(`Listening on url: http://localhost:${port}`);
});