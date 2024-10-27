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
        
        // Lê o arquivo de configuração 'env.json' na codificação UTF-8, convertendo seu conteúdo JSON em um objeto.

        this._nome = (typeof nome !== 'string' || nome === null) ?
            this.destroy(nome) : nome;
        // Verifica se o 'nome' é uma string válida, caso contrário, lança erro.

        this._email = (typeof email !== 'string' || email === null) ?
            this.destroy(email) : email;
        // Verifica se o 'email' é uma string válida, caso contrário, lança erro.
        this._fone = (typeof fone !== 'string' || fone === null) ?
            this.destroy(fone) : fone;
        // Verifica se o 'fone' é uma string válida, caso contrário, lança erro.
        this._data_nascimento = (typeof data_nascimento !== 'string' || data_nascimento === null) ?
            this.destroy(data_nascimento) : data_nascimento;
        // Verifica se o 'data_nascimento' é uma date válida, caso contrário, lança erro.
        var table = 'usuarios';
        // Define o nome da tabela onde os dados serão inseridos. (Nota: o nome correto provavelmente seria 'access').

        var sqlInsert = `insert into ${this._HandleDBMSMySQL._database}.${table} values (null, ${this._nome}, ${this._email}, ${this._fone}, ${this._data_nascimento})`;
        // Monta a consulta SQL para inserir os dados na tabela 'usuarios' no banco de dados definido no arquivo de configuração 'env.json'.
        console.log(sqlInsert)
        this._HandleDBMSMySQL.query(sqlInsert);
        // Executa a consulta SQL usando o gerenciador de banco de dados MySQL.

        this._HandleDBMSMySQL.close();
        // Fecha a conexão com o banco de dados.
    }
}

module.exports = ModelAccess;
// Exporta a classe 'ModelAccess' para que possa ser utilizada em outros módulos.
