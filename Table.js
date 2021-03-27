'use strict';

const Record = require('./Record');

module.exports = class Table {
    constructor(db, options) {

        this.db = db;

        const { name, autoEnsure } = options;

        this.name = name;
        this.autoEnsure = autoEnsure;

    }

    async has(key) {

        const value = await this.db.provider.get(this.name, key) ?? this.autoEnsure;
        return typeof value !== 'undefined';
    }

    async get(key, autoEnsure) {

        const value = await this.db.provider.get(this.name, key) ?? autoEnsure ?? this.autoEnsure;

        return typeof value !== 'undefined' ? new Record(this, key, value) : null;
    }

    set(key, value) {

        return this.db.provider.set(this.name, key, value);
    }

    delete(key) {

        return this.db.provider.delete(this.name, key);
    }
};
