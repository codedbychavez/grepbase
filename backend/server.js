"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let crypto = require('crypto');
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
let cors = require("cors");
const express_session_1 = __importDefault(require("express-session"));
let SQLiteStore = require('connect-sqlite3')(express_session_1.default);
const db_1 = __importDefault(require("./db"));
const authdb_1 = __importDefault(require("./auth/authdb"));
const app = (0, express_1.default)();
const db = new db_1.default();
const authdb = new authdb_1.default();
app.use(express_1.default.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Authentication
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './auth' }),
    cookie: {
        httpOnly: true,
        secure: false, // Change to true in production
        sameSite: "lax"
    }
}));
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy(function verify(username, password, done) {
    const user = authdb.find(username);
    if (!user) {
        return done(null, false, { message: "Incorrect username or password." });
    }
    const storedSalt = Buffer.from(user.salt);
    crypto.pbkdf2(password, storedSalt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
            return done(err);
        }
        const storedPassword = Buffer.from(user.hashedPassword, "hex");
        if (!crypto.timingSafeEqual(storedPassword, hashedPassword)) {
            return done(null, false, { message: "Incorrect username or password." });
        }
        return done(null, user);
    });
}));
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});
passport_1.default.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
app.get("/auth/check-session", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.status(401).json({ error: "Not authenticated" });
    }
});
app.post("/auth/login", (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err)
            return next(err); // Handle server errors
        if (!user)
            return res.status(401).json({ message: info.message }); // Handle invalid login
        // If authentication is successful, log in the user
        req.login(user, (loginErr) => {
            if (loginErr)
                return next(loginErr);
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});
app.get("/auth/signout", (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return res.status(401).json({ message: "Signout failed" });
        }
        return res.json({ message: "Signout successful" });
    });
});
app.post("/auth/signup", (req, res, next) => {
    let { username, password } = req.body;
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
            res.status(401).json({ error: "Failed to create" });
            return next(err);
        }
        const data = authdb.get();
        const item = {
            username: username,
            hashedPassword: hashedPassword,
            salt: salt,
        };
        data.push(item);
        authdb.set(data);
        res.status(200).json({ error: "Create successful" });
    });
});
app.get("/stores", (req, res) => {
    const data = db.getStores();
    data ? res.json(data) : res.status(404).json({ error: "Not Found" });
});
app.patch("/stores/:store/:id", (req, res) => {
    let didUpdate = false;
    const { store, id } = req.params;
    const data = db.get(req.params.store);
    const item = data.find((item) => item.id == id);
    if (item) {
        const indexOfItem = data.indexOf(item);
        data[indexOfItem] = req.body;
        db.set(store, data);
        didUpdate = true;
    }
    didUpdate ? res.json(didUpdate) : res.status(404).json({ error: "Failed to update" });
});
app.post("/stores/create", (req, res) => {
    let didCreate = false;
    const { name } = req.body;
    if (name) {
        didCreate = db.set(name, []);
    }
    didCreate ? res.json(didCreate) : res.status(404).json({ error: "Failed to create" });
});
app.patch("/stores/rename", (req, res) => {
    let didRename = false;
    const { oldName, newName } = req.body;
    if (oldName && newName) {
        db.renameStore(oldName, newName);
        didRename = true;
    }
    didRename ? res.json(didRename) : res.status(404).json({ error: "Failed to rename" });
});
app.post("/stores/delete", (req, res) => {
    let didDelete = false;
    const { name } = req.body;
    if (name) {
        db.delete(name);
        didDelete = true;
    }
    didDelete ? res.json(didDelete) : res.status(404).json({ error: "Failed to delete" });
});
app.post("/stores/:store/create", (req, res) => {
    let didCreate = false;
    const { store } = req.params;
    const data = db.get(req.params.store);
    const item = req.body;
    if (item) {
        data.push(item);
        db.set(store, data);
        didCreate = true;
    }
    didCreate ? res.json(didCreate) : res.status(404).json({ error: "Failed to create" });
});
app.patch("/stores/:store", (req, res) => {
    let didUpdate = false;
    const { store } = req.params;
    const storeData = req.body;
    if (storeData) {
        db.set(store, storeData);
        didUpdate = true;
    }
    didUpdate ? res.json(didUpdate) : res.status(404).json({ error: "Failed to create" });
});
app.delete("/stores/:store/:id", (req, res) => {
    let didDelete = false;
    const { store, id } = req.params;
    const data = db.get(req.params.store);
    const item = data.find((item) => item.id == id);
    if (item) {
        const indexOfItem = data.indexOf(item);
        data.splice(indexOfItem, 1);
        db.set(store, data);
        didDelete = true;
    }
    didDelete ? res.json(didDelete) : res.status(404).json({ error: "Failed to delete" });
});
app.get("/stores/:store", (req, res) => {
    const data = db.get(req.params.store);
    data ? res.json(data) : res.status(404).json({ error: "Store not found" });
});
app.post("/query", (req, res) => {
    const result = db.find(req.body);
    res.json(result);
});
app.delete("/stores/:store", (req, res) => {
    db.delete(req.params.store);
    res.json({ message: "Data deleted successfully!" });
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
