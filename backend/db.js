import fs from "fs";

class JSONDatabase {
    filename;
    data = this.loadData();

    constructor(filename = "data.json") {
        this.filename = filename;
        this.data = this.loadData();
    }

    loadData() {
        try {
            return JSON.parse(fs.readFileSync(this.filename, "utf8"));
        } catch (error) {
            return {}
        }
    }

    saveData() {
        fs.writeFileSync(this.filename, JSON.stringify(this.data, null, 2));
    }

    set(store, value) {
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
        return Object.values(this.data).filter((obj) =>
            Object.keys((filter).every((key) => obj[key] === filter[key])))
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

export default JSONDatabase;