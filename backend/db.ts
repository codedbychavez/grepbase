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

    set(key: string, value: any): void {
        this.data[key] = value;
        this.saveData();
    }

    get(key: string): any | null {
        return this.data[key] || null;
    }

    getKeys(): Array<string> | null {
        return Object.keys(this.data);
    }

    find(filter: Record<string, any>): any[] {
        return Object.values(this.data).filter((obj: any) =>
            Object.keys((filter).every((key: any) => obj[key] === filter[key])))
    }

    delete(key: string): void {
        delete this.data[key];
        this.saveData();
    }
}

export default JSONDatabase;