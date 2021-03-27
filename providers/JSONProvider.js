'use strict';

const Fs = require('fs/promises');
const Path = require('path');

module.exports = class JSONlProvider {

    constructor(options) {

        const { dataDir = './data' } = options;

        this.dataDir = dataDir;
    }

    async initialize() {

        try {
            await Fs.mkdir(this.dataDir);
        }
        catch {}

        return this;
    }

    resolve(...path) {

        return Path.join(this.dataDir, ...path);
    }

    async ensureTable(table) {

        try {
            await Fs.mkdir(this.resolve(table));
        }
        catch {}

        return this;
    }

    async has(table, key) {

        let exists = false;
        try {
            await Fs.stat(this.resolve(table, `${key}.json`));
            exists = true;
        }
        catch {
        }

        return exists;
    }

    async get(table, key) {

        try {
            const json = JSON.parse(await Fs.readFile(this.resolve(table, `${key}.json`), { encoding: 'utf-8' }));
            return json;
        }
        catch {
            return undefined;
        }
    }

    async set(table, key, value) {

        const json = JSON.stringify(value);

        await Fs.writeFile(this.resolve(table, `${key}.json`), json, { encoding: 'utf-8' });

        return JSON.parse(json);
    }

    async delete(table, key) {

        if (this.has(table, key)) {

            await Fs.unlink(this.resolve(table, `${key}.json`));
            return true;
        }

        return false;
    }
};
