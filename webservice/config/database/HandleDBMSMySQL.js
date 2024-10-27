const fs = require('fs');
// Importa o módulo 'fs' para manipular o sistema de arquivos (ler e escrever arquivos).

const mysql = require('mysql');
// Importa o módulo 'mysql' para criar e gerenciar conexões com um banco de dados MySQL.

class HandleDBMSMySQL {
    constructor(host = null, database = null, user = null, password = null) {
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8','r'));
        // Lê o arquivo 'env.json', que contém as configurações de banco de dados, e converte seu conteúdo para um objeto JSON.
        
    
    if (envFile) {
        // Verifica se o arquivo de configuração foi lido corretamente.

        this._host = (typeof host !== 'string' || host === null) ? envFile.host : host;
        // Define o host. Se o valor fornecido for inválido, usa o valor do arquivo de configuração.

        this._database = (typeof database !== 'string' || database === null) ? envFile.database : database;
        // Define o nome do banco de dados, utilizando o valor do arquivo de configuração se nenhum for passado.

        this._user = (typeof user !== 'string' || user === null) ? envFile.user : user;
        // Define o usuário do banco de dados. Se o valor for inválido, usa o valor do arquivo de configuração.

        this._password = (typeof password !== 'string' || password === null) ? envFile.password : password;
        // Define a senha do banco de dados. Se o valor for inválido, usa a senha do arquivo de configuração.

        this.connect();
        // Chama a função 'connect' para estabelecer a conexão com o banco de dados usando as credenciais fornecidas.
    }
    }
    connect() {
        this.connection = mysql.createConnection({
            host: this._host,
            database: this._database,
            user: this._user,
            password: this._password
        });
        // Cria uma conexão com o banco de dados MySQL utilizando as credenciais e configurações armazenadas.
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (Array.isArray(results)) {
                        // Caso de uma consulta SELECT que retorna várias linhas
                        var resultsJSON = { 'metadata': {}, 'data': {} };
                        //resultsJSON.metadata = fields.map((r) => Object.assign({}, r));
                        resultsJSON.data = results.map((r) => Object.assign({}, r));
                        resolve(resultsJSON);
                    } else {
                        // Caso de uma consulta INSERT/UPDATE/DELETE que não retorna linhas
                        resolve({ message: "Operação realizada com sucesso!", results });
                    }
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            // Retorna uma promessa que tenta fechar a conexão com o banco de dados.

            this.connection.end(err => {
                if (err) {
                    reject(err);
                    // Se houver um erro ao tentar fechar a conexão, a promessa será rejeitada com o erro.
                } else {
                    resolve();
                    // Se a conexão for fechada corretamente, a promessa é resolvida.
                }
            });
        });
    }
}

module.exports = HandleDBMSMySQL;
// Exporta a classe 'HandleDBMSMySQL' para que possa ser utilizada em outros módulos.
