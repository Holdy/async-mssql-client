'use strict';

const { Connection, Request, TYPES } = require('tedious');

const AbstractSqlRequest = require('./lib/AbstractSqlRequest');
const AbstractSqlConnection = require('./lib/AbstractSqlConnection');
const AbstractSqlRecordset = require('./lib/AbstractSqlRecordset');

async function getOpenConnectionAsync(config) {

    var config = {
        server: config.get('hostname'),
        authentication: {
            type: "default",
            options: {
                userName: config.get('username'),
                password: config.get('password')
            }
        }
    };

    return new Promise((resolve, reject) => {

        let connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                reject(err);
            } else {
                let abstraction = new AbstractSqlConnection();
                abstraction.tediousConnection = connection;
                resolve(abstraction);
            }
        });
    });
}

module.exports.getOpenConnectionAsync = getOpenConnectionAsync;
module.exports.Request = AbstractSqlRequest;
module.exports.Recordset = AbstractSqlRecordset;
 