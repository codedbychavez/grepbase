import fs from "fs";

interface JSONData {
    [key: string]: any;
}

class JSONDatabase {
    private filename: string;
    private data = this.loadData();

    constructor(filename: string = "data.json") {
        this.filename = filename;
        this.data = this.loadData();
    }

    private loadData(): JSONData {
        try {
            return JSON.parse(fs.readFileSync(this.filename, "utf8"));
        } catch (error) {
            return {}
        }
    }

    private saveData(): void {
        fs.writeFileSync(this.filename, JSON.stringify(this.data, null, 2));
    }

    set(store: string, value: any): boolean {
        this.data[store] = value;
        this.saveData();
        return true;
    }

    get(store: string): any | null {
        return this.data[store] || null;
    }

    getStores(): Array<string> | null {
        return Object.keys(this.data);
    }

    find(filter: Record<string, any>): any[] {
        return Object.values(this.data).filter((obj: any) =>
            Object.keys((filter).every((key: any) => obj[key] === filter[key])))
    }

    delete(store: string): void {
        delete this.data[store];
        this.saveData();
    }

    renameStore(oldName: string, newName: string): boolean {
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