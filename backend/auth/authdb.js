import fs from "fs";

class JSONAuthDatabase {
  filename;
  authData;

  constructor(filename = "./auth/auth.json") {
    this.filename = filename;
    this.authData = this.loadAuthData();
  }

  loadAuthData() {
    try {
      return JSON.parse(fs.readFileSync(this.filename, "utf8"));
    } catch (error) {
      return {}
    }
  }

  saveData() {
    fs.writeFileSync(this.filename, JSON.stringify(this.authData, null, 2));
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
    if (!Array.isArray(this.authData.auth)) return null;
    return this.authData.auth.find((user) => user.username === username) || null;
  }

}

export default JSONAuthDatabase;