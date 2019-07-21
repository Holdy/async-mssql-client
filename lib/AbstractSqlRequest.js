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

"RequestError: The data for table-valued parameter "@Segments" doesn't conform to the table type of the parameter. 
SQL Server error is: 515, state: 2    at Parser.tokenStreamParser.on.token(C: \projects\async - mssql - client\node_modules\tedious\lib\connection.js: 740: 27)    at emitOne(events.js: 116: 13)    at Parser.emit(events.js: 211: 7)    at Parser.parser.on.token(C: \projects\async - mssql - client\node_modules\tedious\lib\token\token - stream - parser.js: 27: 14)    at emitOne(events.js: 116: 13)    at Parser.emit(events.js: 211: 7)    at addChunk(C: \projects\async - mssql - client\node_modules\readable - stream\lib\_stream_readable.js: 297: 12)    at readableAddChunk(C: \projects\async - mssql - client\node_modules\readable - stream\lib\_stream_readable.js: 279: 11)    at Parser.Readable.push(C: \projects\async - mssql - client\node_modules\readable - stream\lib\_stream_readable.js: 240: 10)    at Parser.Transform.push(C: \projects\async - mssql - client\node_modules\readable - stream\lib\_stream_transform.js: 139: 32)    at doneParsing(C: \projects\async - mssql - client\node_modules\tedious\lib\token\stream - parser.js: 80: 14)    at token(C: \projects\async - mssql - client\node_modules\tedious\lib\token\infoerror - token - parser.js: 48: 5)    at call.lineNumber(C: \projects\async - mssql - client\node_modules\tedious\lib\token\infoerror - token - parser.js: 13: 19)    at awaitData(C: \projects\async - mssql - client\node_modules\tedious\lib\token\stream - parser.js: 179: 7)    at Parser.awaitData(C: \projects\async - mssql - client\node_modules\tedious\lib\token\stream - parser.js: 103: 7)    at Parser.readUInt32LE(C: \projects\async - mssql - client\node_modules\tedious\lib\token\stream - parser.js: 176: 10)"