'use strict';

const { TYPES } = require('tedious');

module.exports.Bit =                  { tediousType: TYPES.Bit };
module.exports.BigInt =               { tediousType: TYPES.BigInt };
module.exports.Datetime =             { tediousType: TYPES.DateTime };
module.exports.Int =                  { tediousType: TYPES.Int };
module.exports.TableValuedParameter = { tediousType: TYPES.TVP };
module.exports.UniqueIdentifier =     { tediousType: TYPES.UniqueIdentifier };
module.exports.Varchar =              { tediousType: TYPES.VarChar };
