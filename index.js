'use strict';

const Database = require('./Database');

module.exports = {
    name: 'database',
    register: async (wrapper, options) => {

        const db = new Database(options);
        await db._initialize();
        wrapper.expose('db', db);
    },
};
