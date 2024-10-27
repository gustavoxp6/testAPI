const fs = require('fs'); 
// Importa o módulo 'fs' para trabalhar com o sistema de arquivos, como leitura e escrita de arquivos.

const HandleDBMSMySQL = require('../config/database/HandleDBMSMySQL');
// Importa uma classe/módulo para gerenciar a conexão e consultas ao banco de dados MySQL.
const mysql = require('mysql');
const { Object } = require('crypto');
// Importa o 'KeyObject' da biblioteca 'crypto', usado para manipulação de objetos de chave criptográfica.

class ModelAccess {
    constructor() {
        this._HandleDBMSMySQL = new HandleDBMSMySQL();
        // Inicializa uma nova instância do gerenciador de banco de dados MySQL.
        var envFile = JSON.parse(fs.readFileSync('./config/server/env.json', 'utf8'));
        console.log('Configurações carregadas:', envFile);
        
    }
    
    destroy(param = null) {
        var varToString = varObj => Object.keys(varObj)[0];
        // Converte um objeto para uma chave criptográfica usando KeyObject e retorna o primeiro elemento.
        
        new Error('Parametros incorretos para a classe: \`%$\`, parametro \`%$\`', this.constructor.name, varToString({ param }));
        // Lança um erro personalizado com uma mensagem, incluindo o nome da classe e o parâmetro passado.
    }

    getAccess(id = null, limit = null) {
        // Método para buscar registros da tabela 'usuarios'.

        var sqlSelect = `SELECT * FROM ${this._HandleDBMSMySQL._database}.usuarios`;
        // Cria a consulta SQL para selecionar todos os registros da tabela 'usuarios'.

        if (id) {
            sqlSelect += ` WHERE id = ${mysql.escape(id)}`;
            // Adiciona uma condição para buscar apenas o registro com o ID especificado, se fornecido.
        }

        if (limit) {
            sqlSelect += ` LIMIT ${mysql.escape(limit)}`;
            // Limita o número de resultados se um limite for especificado.
        }
        return this._HandleDBMSMySQL.query(sqlSelect)
            
    }

    postAccess(nome = null, email = null, fone = null, data_nascimento = null) {
        // Função que registra o acesso no banco de dados.
        return new Promise((resolve, reject) => {
       
        var table = 'usuarios';
        // Define o nome da tabela onde os dados serão inseridos. (Nota: o nome correto provavelmente seria 'access').
        var sqlInsert = `INSERT INTO ${this._HandleDBMSMySQL._database}.${table} 
                       VALUES (null, ${mysql.escape(nome)}, ${mysql.escape(email)}, 
                       ${mysql.escape(fone)}, ${mysql.escape(data_nascimento)})`;
        // Monta a consulta SQL para inserir os dados na tabela 'usuarios' no banco de dados definido no arquivo de configuração 'env.json'.
        console.log('Executando a consulta SQL:', sqlInsert, [nome, email, fone, data_nascimento]); // Log antes da consulta
        this._HandleDBMSMySQL.query(sqlInsert, [nome, email, fone, data_nascimento], (err, results) => {
            if (err) {
                console.error('Erro na consulta ao banco de dados:', err); // Log para consulta
                return reject(err); // Aqui, o erro deve ser passado para o catch
            }
            console.log('Resultados da consulta:', results); // Log para resultados
            resolve(results);
        });
        // Executa a consulta SQL usando o gerenciador de banco de dados MySQL.
        
        })
    }
    deleteAccess(id) {
            return new Promise((resolve, reject) => {
                const sql = `DELETE FROM usuarios WHERE id = ${id}`;
                this._HandleDBMSMySQL.query(sql, [id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        
    }
}

module.exports = ModelAccess;
// Exporta a classe 'ModelAccess' para que possa ser utilizada em outros módulos.
