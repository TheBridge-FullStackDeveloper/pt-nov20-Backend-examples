const firebase = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://articulos-2b011-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = firebase.database();

const ref = db.ref("/");
const usersRef = db.ref("/users");

ref.once("value", (snapshot) => {
    // WebSockets              A <-----> B <-------> C
    // fetch (unidireccional)  A ------> B
    //                         A <------ B
    // console.log(snapshot.val());
});

// ref.child("articles").set({
//     2: "art1",
//     3: "art2",
//     4: "art3"
// });


// usersRef.child("jorge").set({
//     name: "jorge",
//     email: "jorge@jorgito.es"
// }, (error) => {
//     if (error)
//         console.log("Ha habido un error", error);
//     else
//         console.log("Se ha establecido el valor de jorge");
// });

// usersRef.push({
//     name: "Margarita",
//     email: "margarita@rita.es"
// });

// usersRef.child("jorge").update({
//     email: "jorge@jorge.com"
// });

// usersRef.transaction(users => {
//     console.log("users:", users);
//     return {...users, pepitoElEspecialito: {
//         name: "Pepito El Especialito"
//     }}
// });

// usersRef.child("jorge").remove();


// Shallow Comparition

usersRef.orderByChild("email").equalTo("pepe@pepon.comi").once("value", snapshot => {
    console.log(snapshot.val());
}, (error) => {
    console.log("We have an error", error);
});

