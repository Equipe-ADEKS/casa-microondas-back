import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const porta = 3000;
const conexao = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "casa_microondas_login",
  user: "root"
});

conexao.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(porta, () => {
  console.log("servidor rodando e escutando na porta 3000");
});

app.get("/", (req, res) => {
  res.status(200).send("Nosso servidor da CMO");
});

app.get("/servicos", (req, res) => {
  res.status(200).send("rota para trazer os servicos ");
});

let html = '';

/*app.post ("/Marcas/Marcas.html", (req, res) => {
  const SQL = "INSERT INTO marcas ()"
  conexao.query()
})*/


app.get("/marcas", (req, res) => {
  html = `<html>
    <head>
      <tittle>Projeto CMO</tittle>
    </head>
    <body>
      <h1>Conserto em 30 minutos</h1>
      <p>Breve descrição</p>
    </body>
      </html>`;
  res.status(200).send(html);
});


//Rotas para inclusão de novos serviços

app.post("/servicos", (req, res) => {
  let tit = req.body.titulo;
  let desc = req.body.desc;
  let url = req.body.url;
  let img = req.body.img;
  let ordem = req.body.ordem;
  let ativo = true;

  conexao.query(
    `call Sp_Ins_Servico (@id, ?, ?, ?, ?, ?, ?, @mensagem)`,
    [tit, desc, img, ordem, url, ativo], (erro, linhas) => {
      if (erro) {
        console.log(erro);
        res.send('Problema ao inserir serviço')
      }
      else {
        console.log(linhas);
        res.send('Serviço inserido');
      }
    });
});

app.post("/marca", (req, res) => {
  let desc = req.body.descricao;
  let url_marca = req.body.url_marca;
  let logo = req.body.logo;
  let flag = true;

  conexao.query(
    `call SP_Ins_Marca (@id, ?, ?, ?, ?, @mensagem)`,
    [desc, url_marca, logo, flag], (erro, linhas) => {
      if (erro) {
        console.log(erro);
        res.send('Problema ao inserir serviço')
      }
      else {
        console.log(linhas);
        res.send('Serviço inserido');
      }
    });
});


//Servidor criado com js puro
//import http from "http";


//const rotas = {
//  "/": "servidor criado com node js para a disciplina WEB Front-End";
//  "/servicos": "Todos os serviços executados pelo CMO";
//  "/marcas": "Apresentação de todas as marcas representadas pela empresa"
//};

//arrow function
//const server = http.createServer((req, res) => {
//    res.writeHead(200, { "Content-type": "text/plain" });
//    res.end(rotas[req.url]);
//});
//server.listen(3000, () => {
//    console.log("Servidor escutando porta 3000");
//});

