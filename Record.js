'use strict';

const Bone = require('@botsocket/bone');

module.exports = class Record {
    constructor(table, key, draft) {

        this.table = table;
        this.key = key;
        this._draft = draft;
        this._object = Bone.isObject(this._draft);
    }

    get(path) {

        if (this._object) {
            return Bone.get(this._draft, path);
        }

        return this._draft;
    }

    has(path) {

        const value = this.get(path);

        return typeof value !== 'undefined';
    }

    set() {

        if (typeof arguments[0] === 'string' && this._object) {
            const [path, value] = arguments;
            this._draft = Bone.set(this._draft, path, value);
        }
        else {
            const [value] = arguments;
            this._draft = value;
            this._object = Bone.isObject(this._draft);
        }

        return this;
    }

    toJSON() {

        return this._draft;
    }

    clone(key) {

        const draft = Bone.clone(this._draft, { shallow: true });

        return new Record(this.table, key ?? this.key, draft);
    }

    async save() {

        await this.table.set(this.key, this._draft);
        return this;
    }

    delete(path) {

        if (path && this._object) {

            Bone.set(this._draft, path, undefined);
            return this;
        }

        return this.table.delete(this.table.name, this.key);
    }
};
