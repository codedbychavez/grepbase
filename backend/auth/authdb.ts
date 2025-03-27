import fs from "fs";

interface JSONAuthData {
  [key: string]: any;
}

class JSONAuthDatabase {
  private filename: string;
  private authData = this.loadAuthData();

  constructor(filename: string = "auth.json") {
    this.filename = filename;
    this.authData = this.loadAuthData();
  }

  private loadAuthData(): JSONAuthData {
    try {
      return JSON.parse(fs.readFileSync(this.filename, "utf8"))
    } catch (error) {
      return {}
    }
  }

  private saveData(): void {
    fs.writeFileSync(this.filename, JSON.stringify(this.authData, null, 2));
  }

  find(filter: Record<string, any>): any[] {
    return Object.values(this.authData).filter((obj: any) =>
      Object.keys((filter).every((key: any) => obj[key] === filter[key])))
  }

}

export default JSONAuthDatabase;