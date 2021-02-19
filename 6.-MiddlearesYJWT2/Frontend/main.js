fetch("http://localhost:8080/user", {
    method: "POST",
    body: JSON.stringify({
        username: "Pepe",
        password: "4589"
    }),
    headers: {
        "Content-Type": "application/json"
    }
}).then(response => response.json()).then(data => console.log(data)).catch(e => console.error(e));