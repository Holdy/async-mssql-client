'use strict';

const Datatype = require('./Datatype');
const { Request } = require('tedious');

function AbstractSqlRequest(sql) {
    this.sql = sql;
}

AbstractSqlRequest.prototype.addIntParameter = function (name, value) {
    return addParameter(this, name, Datatype.Int, value);
}

AbstractSqlRequest.prototype.addUniqueIdentifierParameter = function (name, value) {
    return addParameter(this, name, Datatype.UniqueIdentifier, value);
}

AbstractSqlRequest.prototype.addTableValuedParameter = function (name, value) {
    return addParameter(this, name, Datatype.TableValuedParameter, value);
}

function addParameter(request, name, type, value) {
    if (!request.parameters) {
        request.parameters = [];
    }

    let parameter = {
        name: name,
        type: type,
        value: value
    };

    request.parameters.push(parameter);

    return request;
}

AbstractSqlRequest.prototype.getProcedureResultsAsync = async function (abstractConnection) {
    let rows = [];
    let abstractRequest = this;

    return new Promise((resolve, reject) => {

        // unpack abstract request into a tds request.
        let request = new Request(this.sql, (err, rowCount) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });

        if (abstractRequest.parameters) {
            abstractRequest.parameters.forEach((parameter) => {
                let abstractValue = parameter.value;

                if (abstractValue.isAbstractSqlRecordset) {
                    abstractValue = {columns: abstractValue.columns.map(abstractColumnToTedious), rows: abstractValue.rows};
                }

                request.addParameter(parameter.name, parameter.type.tediousType, abstractValue);
            });
        }

        request.on('row', (row) => {
            rows.push(simplifyRow(row));
        });

        abstractConnection.tediousConnection.callProcedure(request);
    });
}

function abstractColumnToTedious(column) {
    let result = {
        name: column.name,
        type: column.type.tediousType
    };
    if (column.length) {
        result.length = column.length;
    }
    return result;
}



function simplifyRow(row) {
    let result = {};
    row.forEach((column) => {
        result[column.metadata.colName] = column.value;
    });

    return result;
}

module.exports = AbstractSqlRequest;
