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

    filterStoreByObjectKeyValue(store, objectKey, objectValue) {
        let found = [];
        const data = this.get(store);
        data.forEach(obj => {
            if (Object.prototype.hasOwnProperty.call(obj, objectKey)) {
                Object.keys(obj).forEach((key) => {
                    if (obj[key] === objectValue) {
                        found.push(obj);
                    }
                })
            }
        });
        return found;
    }

    filterStoreByObjectKey(store, objectKey, isExclude) {
        let found = [];
        const data = this.get(store);
        data.forEach(obj => {
            if (isExclude) {
                if (!Object.prototype.hasOwnProperty.call(obj, objectKey)) {
                    found.push(obj);
                }
            } else {
                if (Object.prototype.hasOwnProperty.call(obj, objectKey)) {
                    found.push(obj);
                }
            }
        });
        return found;
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