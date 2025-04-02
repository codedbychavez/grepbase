"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class JSONAuthDatabase {
    constructor(filename = "./auth/auth.json") {
        this.filename = filename;
        this.authData = this.loadAuthData();
    }
    loadAuthData() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.filename, "utf8"));
        }
        catch (error) {
            return {};
        }
    }
    saveData() {
        fs_1.default.writeFileSync(this.filename, JSON.stringify(this.authData, null, 2));
    }
    set(value) {
        this.authData['auth'] = value;
        this.saveData();
        return true;
    }
    get() {
        return this.authData['auth'] || null;
    }
    find(username) {
        if (!Array.isArray(this.authData.auth))
            return null;
        return this.authData.auth.find((user) => user.username === username) || null;
    }
}
exports.default = JSONAuthDatabase;
