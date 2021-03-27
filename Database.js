'use strict';

const Table = require('./Table');
const Bone = require('@botsocket/bone');

module.exports = class Database {
    constructor(options) {

        const { provider: Provider, providerOptions, tablePrefix } = options;

        this.providerOptions = providerOptions ?? {};
        this.provider = new Provider(this.providerOptions);
        this.tablePrefix = tablePrefix ?? '';

        this._ready = false;
        this.tables = {};
    }

    async _initialize() {

        if (this._ready) {
            return;
        }

        if (typeof this.provider.initialize === 'function') {
            await this.provider.initialize();
        }

        this._ready = true;
    }

    async table(name, options) {

        Bone.assert(typeof name === 'string', 'Table name must be a string');

        if (this.tables[name]) {
            return this.tables[name];
        }

        const table = new Table(this, { ...options, name: `${this.tablePrefix}${name}` });

        await this.provider.ensureTable(`${this.tablePrefix}${name}`);

        return (this.tables[name] = table);
    }
};
