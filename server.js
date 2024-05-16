import http from "http";

//arrow function
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("Servidor do projeto CMO rodando");
});
server.listen(3000, () => {
    console.log("Servidor escutando porta 3000");
});