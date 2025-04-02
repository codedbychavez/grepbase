"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class JSONDatabase {
    constructor(filename = "data.json") {
        this.data = this.loadData();
        this.filename = filename;
        this.data = this.loadData();
    }
    loadData() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.filename, "utf8"));
        }
        catch (error) {
            return {};
        }
    }
    saveData() {
        fs_1.default.writeFileSync(this.filename, JSON.stringify(this.data, null, 2));
    }
    set(store, value) {
        if (this.data[store]) {
            console.error(`Store "${store}" already exists.`);
            return false;
        }
        this.data[store] = value;
        this.saveData();
        return true;
    }
    get(store) {
        return this.data[store] || null;
    }
    getStores() {
        return Object.keys(this.data);
    }
    find(filter) {
        return Object.values(this.data).filter((obj) => Object.keys((filter).every((key) => obj[key] === filter[key])));
    }
    delete(store) {
        delete this.data[store];
        this.saveData();
    }
    renameStore(oldName, newName) {
        if (!this.data[oldName]) {
            console.error(`Store "${oldName}" does not exist.`);
            return false;
        }
        if (this.data[newName]) {
            console.error(`Store "${newName}" already exists.`);
            return false;
        }
        this.data[newName] = this.data[oldName];
        delete this.data[oldName];
        this.saveData();
        return true;
    }
}
exports.default = JSONDatabase;
