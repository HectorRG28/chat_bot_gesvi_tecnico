const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Tu usuario de phpMyAdmin
    password: '', // Tu contraseña
    database: 'gesvi_db'
});

module.exports = pool.promise();