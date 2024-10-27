var express = require('express');

// Importa o framework 'express' para criar o roteamento e lidar com requisições HTTP.
const fs = require('fs');
var ip = require('ip');
// Importa o módulo 'ip' para obter o endereço IP da máquina onde o código está rodando.

var os = require('os');
// Importa o módulo 'os' para acessar informações do sistema operacional, como o nome do host.


var router = express.Router();
// Cria uma instância de roteador do Express, usada para definir rotas da aplicação.

var ModelAccess = require('../model/ModelAccess');
// Importa a classe 'ModelAccess' do arquivo que gerencia o acesso ao banco de dados.

var _ModelAccess = new ModelAccess();
// Cria uma instância da classe 'ModelAccess', que será usada para interagir com o banco de dados.

router.route('/')
    // Define a rota base '/' (a raiz da API).

    .get(function (req, res, next) {
        // Manipula requisições GET para a rota '/', usada para buscar dados.

        // Chama o método 'getAccess' da classe 'ModelAccess', sem parâmetros, para buscar todos os registros de acesso.
        _ModelAccess.getAccess(null, null).then(resultJSON => {
            res.status(200).json(resultJSON).end();
            // Se a busca for bem-sucedida, retorna os dados no formato JSON com o status HTTP 200 (sucesso).
        })
            .catch(err => {
                console.error('Erro na requisição: \`get\` para o recurso: ' + err);
                // Em caso de erro, exibe uma mensagem no console com detalhes do erro.

                res.status(500).send(err).end();
                // Retorna uma resposta de erro (status 500) com detalhes do erro.
            });
    })

    .post(function (req, res) {
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8','r'));
        const { nome, email, fone, data_nascimeto } = envFile.body;
        if (!nome || !email || !fone || !data_nascimeto) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }
        _ModelAccess.postAccess(nome.toString(), email.toString(),
            fone.toString(), data_nascimeto.toString())
            .then(resultJSON => {
                res.status(201).json(resultJSON).end();
                console.log('2Chegou!')
            })
            .catch(err => {
                console.error('Erro na requisição \`post\` para o recurso: ' + err);
                res.status(500).send(err).end();
            });
    })


    .put(function (req, res) {
        // Manipula requisições PUT para a rota '/', mas não realiza nenhuma ação.

        res.send('Pela natureza de funcionalidade desta rota, não ha ação de atualização');
        // Retorna uma mensagem indicando que a operação de atualização (PUT) não é suportada nesta rota.
    });

    router.delete('/:id', (req, res) => {
        const { id } = req.params;
    
         _ModelAccess.deleteAccess(id)
        .then(result => {
            if (result.affectedRows > 0) {
                res.status(200).json({ message: `Registro com id ${id} excluído com sucesso.` });
            } else {
                res.status(404).json({ error: `Registro com id ${id} não encontrado.` });
            }
        })
        .catch(error => {
            console.error('Erro ao deletar registro:', error);
            res.status(500).json({ error: error.message });
        });
    });

module.exports = router;
// Exporta o roteador para ser utilizado em outros arquivos da aplicação.
