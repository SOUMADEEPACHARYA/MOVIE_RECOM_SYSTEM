const mysql = require('mysql');
// const {host, username, password, db} = require('../utils/config.json')['db'];
const host = "localhost";
const username = "root";
const password =  "";
const db = 'SSD_PROJECT';

 


var config = {
    mutlipleStatements: true,
    connectionLimit: 10,
    host: host,
    user: username,
    password: password,
    database: db
};

const pool = mysql.createPool(config);

const getQuery = (query, params = null) => {
    return new Promise((resolve, reject) => {
        // console.log(query)
        if(params === null) {
            pool.query(query, (err, results) => {
                if(err) reject(err);
        
                resolve(results);
            });
        }

        else {
            pool.query(query, params, (err, results) => {
                if(err) reject(err);

                resolve(results);
            });
        }
    });
}

module.exports = {
    getQuery
}