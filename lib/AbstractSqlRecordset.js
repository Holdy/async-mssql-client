'use strict';

const Datatype = require('./Datatype');

function AbstractSqlRecordset() {
    this.columns = [];
    this.rows = [];
}

AbstractSqlRecordset.prototype.addIntColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.Int });
}

AbstractSqlRecordset.prototype.addVarcharColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.Varchar });
}

AbstractSqlRecordset.prototype.addDatetimeColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.Datetime });
}
 
AbstractSqlRecordset.prototype.addUniqueIdentifierColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.UniqueIdentifier });
}

AbstractSqlRecordset.prototype.addBigIntColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.BigInt });
}

AbstractSqlRecordset.prototype.addBitColumn = function (name) {
    this.columns.push({ name: name, type: Datatype.Bit});
}

AbstractSqlRecordset.prototype.addRow = function (valueArray) {
    this.rows.push(valueArray);
}

AbstractSqlRecordset.prototype.isAbstractSqlRecordset = true;

module.exports = AbstractSqlRecordset;