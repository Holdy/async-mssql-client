'use strict';

const { expect } = require('chai');
const { TYPES } = require('tedious');
const sut = require('../../lib/Datatype');

describe('Datatype', () => {

    it('should contain types that map to tedious types', () => {

        Object.keys(sut).forEach((key) => {
            let item = sut[key];
            expect(isTediousType(item.tediousType), `Item with key [${key}].tediousType is not in tedious.TYPES` ).to.equal(true);
        });

    });

    function isTediousType(value) {
        let typeFound = false;
        Object.values(TYPES).forEach((item) => {
            if (value == item) {
                typeFound = true;
            }
        });
        return typeFound;
    }

});