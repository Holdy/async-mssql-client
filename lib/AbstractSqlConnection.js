'use strict';

function AbstractSqlConnection() {

}

AbstractSqlConnection.prototype.closeAsync = async function () {
    let innerConnection = this.tediousConnection;

    return new Promise((resolve, reject) => {

        innerConnection.on('end', function () {
            resolve();
        });

        try {
            innerConnection.close();
        } catch (e) {
            reject(e);
        }

    });
    
}

module.exports = AbstractSqlConnection;