const prefix = "admin-"
const pattern = new RegExp(`${prefix}[A-Za-z]`, "gmi");
// const pattern = /[A-Za-z]/gmi
let string = prompt("Introduce tu nombre de usuario");

alert(pattern.test(string));