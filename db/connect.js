const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'qcB$s^d(j*95,:L+Q!@ffZc',
        database: 'workforce'
    },
);

module.exports = db;