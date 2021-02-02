const users = {
	"28": {
		"name": "Miguel Ángel",
		"surname": "Florido",
		"role": "Teacher"
	},
	"54560416": {
		"name": "Susana",
		"surname": "Pérez",
		"role": "CTO"
	}
}

/*
	GET		- Obtener datos
	POST	- Crear nuevos datos
	PUT		- Actualizar datos existentes
	DELETE	- Borrar datos existentes



*/

/*
	Imports
*/
const express = require("express");


/*
	Config vars
*/
const port = 8080;
const server = express();

// Middleware
server.use(express.static("./public"));

/*
	Make the endpoints
*/
server.get("/", (req, res) => {
	console.log(req.query);
	res.send({"msg": "Hello World"});
});

server.post("/", (req, res) => {
	res.send({msg: "Hello World", method: "post"});
});

server.get("/data", (req, res) => {
	if (req.query.type === "numbers")
		res.send({data: [1, 43, 5, 3, 5, 3, 5, 6, 3]});
	else
		res.send({data: ["hola", "asd", "sdf", "sdfjgkl"]});
});

server.get("/userData", (req, res) => {
	const userId = req.query.userId; // Recibo la id del usuario
	/*
		Miraría en Base de Datos, pediría la información del usuario: userId
	*/
	const userInfo = users[userId];


	/*
		Operador Ternario
			[Condición] ? [Código si true] : [Código si false]

			let age = 16;

			const msg = age > 17 ? "Puedes pasar" : "No puedes pasar"
	*/
	res.send(userInfo ? userInfo : {"error": "user not found"});

	/*
		La línea de arriba reemplaza a:
			if (userInfo)
				res.send(userInfo); // Mando la información de dicho usuario
			else
				res.send({"error": "user not found"});
	*/
});

/*
	Start Server
*/
server.listen(port, () => {
	console.log(`Listening on: http://localhost:${port}`);
});