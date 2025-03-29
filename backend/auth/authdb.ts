import fs from "fs";

interface JSONAuthData {
  [key: string]: any;
}

class JSONAuthDatabase {
  private filename: string;
  private authData: JSONAuthData;

  constructor(filename: string = "./auth/auth.json") {
    this.filename = filename;
    this.authData = this.loadAuthData();
  }

  private loadAuthData(): JSONAuthData {
    try {
      return JSON.parse(fs.readFileSync(this.filename, "utf8"));
    } catch (error) {
      return {}
    }
  }

  private saveData(): void {
    fs.writeFileSync(this.filename, JSON.stringify(this.authData, null, 2));
  }

  set(value: any): boolean {
    this.authData['auth'] = value;
    this.saveData();
    return true;
  }

  get(): any | null {
    return this.authData['auth'] || null;
  }

  find(username: string): any | null {
    if (!Array.isArray(this.authData.auth)) return null;
    return this.authData.auth.find((user: any) => user.username === username) || null;
  }

}

export default JSONAuthDatabase;