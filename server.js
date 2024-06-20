import express from "express";
import bodyParser from "body-parser";
import sqlServer from "mssql"
import jwt from "jsonwebtoken";
import cors from 'cors';

const dbConfig = {
    server: "52.5.245.24",
    database: "cmo",
    user: "adminCMO",
    password: "@Uniandrade_2024",
    port: 1433,
    options: {
        trustServerCertificate: true,
    }
};

const conexao = sqlServer.connect(dbConfig, (err) => {
    if (err)
        console.log(err)
    else
        console.log('conectado com sql server.');
});

const SEGREDO = 'REMOTA';

const app = express();
const porta = 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/*
const conexao = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "cmo2",
    user: "root"
});

conexao.connect();
*/

app.listen(porta, () => {
    console.log("Servidor rodando e escutando na porta 5000.")
});

app.get("/", (req, resp) => {
    resp.status(200).send("Nosso servidor da PD")
});



let html = '';

app.get("/marcas", (req, resp) => {
    html = `
        <html>
            <head>
                <title>Biblioteca</title>
            </head>
            <body>
                <h1>Prateleira Digital</h1>
                <p>Este é o projeto pd!!!!!!!!!!</p>
            </body>
        </html>`;
    resp.status(200).send(html

    );
});



app.get("/modelos", (req, resp) => {
    resp.status(200).send("Rota para trazer os modelos");
});

app.get("/cadastro", (req, resp) => {
    resp.status(200).send("Rota para cadastro");
});



// middleware
function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SEGREDO, (erro, decodificado) => {
        if (erro)
            return res.status(401).end();
        req.id = decodificado.id;
        next();
    });
}

app.post("/login", (req, res) => {
    let usu = req.body.usuario;
    let sen = req.body.senha;

    // conectar ao bd pra buscar o ID desse usuario

    //if usu e a senha for igual ao registrado na tabela do BD
    if (usu == "marcos" && sen == "123") {
        const id = 1; // isso vem do BD

        //token tem 3 partes = 1.) identifica o usuário 2.) segredo, opções 
        const token = jwt.sign({ id }, SEGREDO, { expiresIn: 300 }); // 5 min

        console.log("usuário marcos logou no sistema");
        return res.status(500).json({ autenticado: true, token: token });
    };
    res.status(504).send("Usuário inválido ou inexitente");
});

// Rota para inclusão de novos serviços

// Rota para inclusão de novas marcas

/*app.post("/marcas", (req, resp) => {
    let descricao = req.body.descricao;
    let url = req.body.url;
    let logo = req.body.logo;
    let flag = true;

    conexao.query(
        `CALL SP_Ins_Marca(?, ?, ?, ?, @id, @mensagem)`,
        [descricao, url, logo, flag], (erro, linha) => {
            if (erro) {
                console.log(erro);
                resp.send('problema ao inserir marca');
            }
            else {
                console.log(linha);
                resp.send('Marca inserida!');
            }

        });

});*/

// Rota para inclusão de novos tipos produto


// GET PARA O SITE 
app.get("/tipoProduto", (req, resp) => {
    let id_tipo = req.body.id_tipo;
    let desc_tipo = req.body.desc_tipo;
    let ativo = '1';

    conexao.query(`SELECT id_tipo,
        desc_tipo,
        ativo
    FROM TipoProduto WHERE ativo = 1`)
        .then(resut => resp.json(resut.recordset))
        .catch(err => resp.json(err));


});

app.get("/tipoProduto/:id_tipo", (req, res) => {
    let id_tipo = req.params.id_tipo;


    conexao.query(`SELECT id_tipo,
        desc_tipo,
        ativo
    FROM TipoProduto WHERE id_tipo = ${id_tipo}`)
        .then(resut => res.json(resut.recordset))
        .catch(err => res.json(err));


});

app.post("/tipoProduto", (req, res) => {

    let desc = req.body.desc_tipo;
    let ativo = '1';

    conexao.query(`exec SP_Ins_TipoProduto( '${desc}')`, (erro, res) => {
        if (erro) {
            console.log(erro);
            res.status(500).send('Problema ao atualizar o Tipo de Produto');
        } else {
            console.log(resultado);
            res.status(200).send('Tipo de produto  atualizado com sucesso');
        }

    });

});





app.post("/servicos", (req, res) => {
    let tit = req.body.titulo;
    let desc = req.body.desc;
    let url = req.body.url;
    let img = req.body.img;
    let ordem = req.body.ordem;
    let ativo = '1';
    conexao.query(`exec SP_Ins_Servico
         '${tit}', '${desc}', '${url}', 
         '${img}', ${ordem}, ${ativo}`, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            res.status(500).send('Problema ao inserir serviço');
        } else {
            console.log(resultado);
            res.status(200).send('Servico inserido com sucesso');
        }
    });
});


app.put('/servicos', (req, res) => {

    let id = req.body.id_servico;
    let tit = req.body.titulo;
    let desc = req.body.desc;
    let url = req.body.url;
    let img = req.body.img;
    let ordem = req.body.ordem;
    let ativo = req.body.ativo;
    conexao.query(`exec SP_Upd_Servico
        '${id}', '${tit}', '${desc}', '${url}', 
        '${img}', ${ordem}, ${ativo}`, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            res.status(500).send('Problema ao atualizar serviço');
        } else {
            console.log(resultado);
            res.status(200).send('Servico atualizado com sucesso');
        }
    });
});

// GET PARA O FORMULARIO
app.get("/servico/:id", (req, res) => {
    let id_servico = req.params.id;
    conexao.query(`SELECT id_servico
                    titulo_servico
                    desc_servico
                    url_servico
                    ordem_apresentacao,
                    ativo
                FROM servico WHERE id_servico = ${id_servico}`)
        .then(resut => res.json(resut.recordset))
        .catch(err => res.json(err));

});

// GET PARA O SITE
app.get("/servicos", (req, resp) => {
    conexao.query(`SELECT id_servico
        titulo_servico
        desc_servico
        url_servico
        ordem_apresentacao,
        ativo
    FROM servico WHERE ativo = 1
    ORDER BY ORDEM_APRESENTACAO`)
        .then(resut => resp.json(resut.recordset))
        .catch(err => resp.json(err))

});

// GET PARA O ADMINISTRADOR
app.get("/admservico", (req, res) => {
    conexao.query(`SELECT id_servico
                    titulo_servico
                    desc_servico
                    url_servico
                    ordem_apresentacao,
                    ativo
                FROM servico 
                ORDEM BY ORDEM_APRESENTACAO`)
        .then(resut => res.json(result.recordset))
        .catch(err => res.json(err))
});


app.delete('/servicos/:id', (req, res) => {

    let id = req.params.id;

    conexao.query(`exec SP_Del_Servico '${id}'`, (erro, resultado) => {
        if (erro) {
            console.log(erro);
            res.status(500).send('Problema ao excluir o serviço');
        } else {
            console.log(resultado);
            res.status(200).send('Servico excluido com sucesso');
        }
    });
});


/*import http from "http";
 Servisor criado com js puro
const rotas = {
    "/": "servidor criado com Node.js para a disciplina WEB Front-End",
    "/servicos": "Todos os servicos executados pela CMO",
    "/marcas": "Apresentacao de todas as marcas representadas pela empresa"
};

// arrow function
const server = http.createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end(rotas[req.url])
});

server.listen(3000,() => {
    console.log("servidor escutando porta 3000")
})*/
