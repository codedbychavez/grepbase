import express, { NextFunction, Request, Response } from "express";
let crypto = require('crypto');
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
let cors = require("cors");
import session from 'express-session';

let SQLiteStore = require('connect-sqlite3')(session);

import JSONDatabase from "./db";
import JSONAuthDatabase from "./auth/authdb";

const app = express();
const db = new JSONDatabase();
const authdb = new JSONAuthDatabase();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));

// Authentication
app.use(session({
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

app.use(passport.session());

passport.use(new LocalStrategy(
    function verify(username: string, password: string, done: (error: any, user?: any, info?: any) => void) {

        const user = authdb.find(username);

        if (!user) {
            return done(null, false, { message: "Incorrect username or password." })
        }

        const storedSalt = Buffer.from(user.salt);

        crypto.pbkdf2(password, storedSalt, 310000, 32, 'sha256', function (err: any, hashedPassword: string) {

            if (err) { return done(err); }

            const storedPassword = Buffer.from(user.hashedPassword, "hex");

            if (!crypto.timingSafeEqual(storedPassword, hashedPassword)) {
                return done(null, false, { message: "Incorrect username or password." });
            }

            return done(null, user);
        })
    }))

passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username })
    })
});

passport.deserializeUser(function (user: any, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

app.get("/auth/check-session", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
})

app.post("/auth/login", (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('local', (err: any, user: any, info: { message: any; }) => {

        if (err) return next(err); // Handle server errors
        if (!user) return res.status(401).json({ message: info.message }); // Handle invalid login

        // If authentication is successful, log in the user
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
})

app.get("/auth/signout", (req: Request, res: Response, next: NextFunction) => {
    req.logOut(function (err) {
        if (err) {
            return res.status(401).json({ message: "Signout failed" })
        }
        return res.json({ message: "Signout successful" })
    })
})

app.post("/auth/signup", (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    let salt = crypto.randomBytes(16);

    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function (err: any, hashedPassword: any) {
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
    })

})

app.get("/stores", (req: Request, res: Response) => {
    const data = db.getStores();
    data ? res.json(data) : res.status(404).json({ error: "Not Found" });
})

app.patch("/stores/:store/:id", (req: Request, res: Response) => {
    let didUpdate = false;
    const { store, id } = req.params;
    const data = db.get(req.params.store);
    const item = data.find((item: { id: string; }) => item.id == id);
    if (item) {
        const indexOfItem = data.indexOf(item);
        data[indexOfItem] = req.body;
        db.set(store, data);
        didUpdate = true;
    }
    didUpdate ? res.json(didUpdate) : res.status(404).json({ error: "Failed to update" });
})

app.post("/stores/create", (req: Request, res: Response) => {
    let didCreate = false;
    const { name } = req.body;
    if (name) {
        didCreate = db.set(name, []);
    }
    didCreate ? res.json(didCreate) : res.status(404).json({ error: "Failed to create" });
})

app.patch("/stores/rename", (req: Request, res: Response) => {
    let didRename = false;
    const { oldName, newName } = req.body;
    if (oldName && newName) {
        db.renameStore(oldName, newName);
        didRename = true;
    }
    didRename ? res.json(didRename) : res.status(404).json({ error: "Failed to rename" });
})

app.post("/stores/delete", (req: Request, res: Response) => {
    let didDelete = false;
    const { name } = req.body;
    if (name) {
        db.delete(name);
        didDelete = true;
    }
    didDelete ? res.json(didDelete) : res.status(404).json({ error: "Failed to delete" });
})

app.post("/stores/:store/create", (req: Request, res: Response) => {
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
})

// Update a store data
app.patch("/stores/:store", (req: Request, res: Response) => {
    let didUpdate = false;
    const { store } = req.params;
    const storeData = req.body;
    console.log(storeData)
    if (storeData) {
        db.set(store, storeData);
        didUpdate = true;
    }
    didUpdate ? res.json(didUpdate) : res.status(404).json({ error: "Failed to Update" });
})

// Delete an item from a store
app.delete("/stores/:store/:id", (req: Request, res: Response) => {
    let didDelete = false;
    const { store, id } = req.params;
    const data = db.get(req.params.store);
    const item = data.find((item: { id: string; }) => item.id == id);
    if (item) {
        const indexOfItem = data.indexOf(item);
        data.splice(indexOfItem, 1)
        db.set(store, data);
        didDelete = true;
    }
    didDelete ? res.json(didDelete) : res.status(404).json({ error: "Failed to delete" });
})

// Get store and its data
app.get("/stores/:store", (req: Request, res: Response) => {
    const data = db.get(req.params.store);
    data ? res.json(data) : res.status(404).json({ error: "Store not found" });
});

// Query a store item
app.post("/query", (req: Request, res: Response) => {
    const result = db.find(req.body);
    res.json(result);
});

// Delete a store
app.delete("/stores/:store", (req: Request, res: Response) => {
    db.delete(req.params.store);
    res.json({ message: "Data deleted successfully!" });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});