const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const config = {
    user: 'User banco',
    password: 'Senha de acesso ao banco',
    server: 'localhost',
    port: 1433,
    database: 'Seu banco de dados',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 15000,
        requestTimeout: 30000
    }
};

sql.connect(config, err => {
    if (err) {
        console.log('Erro de conexão:', err);
        return;
    }
    console.log('Conectado ao banco de dados');

    app.post('/api/gastos', (req, res) => {
        const { nome, data, descricao, valor, local } = req.body;

        const query = `INSERT INTO Gastos (Nome, Data, Descricao, Valor, Local) 
                       VALUES (@nome, @data, @descricao, @valor, @local)`;

        const request = new sql.Request();
        request.input('nome', sql.VarChar, nome)
               .input('data', sql.Date, data)
               .input('descricao', sql.VarChar, descricao)
               .input('valor', sql.Decimal(10, 2), valor)
               .input('local', sql.VarChar, local)
               .query(query, (err, result) => {
                   if (err) {
                       console.log('Erro na execução da query:', err);
                       res.status(500).send({ message: 'Erro no envio dos dados.' });
                   } else {
                       console.log('Dados inseridos com sucesso:', result);
                       res.status(200).send({ message: 'Dados enviados com sucesso!' });
                   }
               });
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002');
});
