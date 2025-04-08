import express from "express";
import crypto from "crypto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

import session from "express-session";
import connectSqlite3 from "connect-sqlite3";

import JSONDatabase from "./db.js";
import JSONAuthDatabase from "./auth/authdb.js";

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SQLiteStore = connectSqlite3(session);

const app = express();
const db = new JSONDatabase();
const authdb = new JSONAuthDatabase();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: "sessions.db", dir: "./auth" }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}));

app.use(passport.session());

// Serve uploaded files
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads/", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir)
  },
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Passport Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  const user = authdb.find(username);
  if (!user) return done(null, false, { message: "Incorrect username or password." });

  const storedSalt = Buffer.from(user.salt);
  crypto.pbkdf2(password, storedSalt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) return done(err);

    const storedPassword = Buffer.from(user.hashedPassword, "hex");
    const match = crypto.timingSafeEqual(storedPassword, hashedPassword);
    return match ? done(null, user) : done(null, false, { message: "Incorrect username or password." });
  });
}));

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, username: user.username }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

// Auth Routes
app.get("/auth/check-session", (req, res) => {
  req.isAuthenticated()
    ? res.json({ user: req.user })
    : res.status(401).json({ error: "Not authenticated" });
});

app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.get("/auth/signout", (req, res) => {
  req.logOut(err => {
    if (err) return res.status(401).json({ message: "Signout failed" });
    res.json({ message: "Signout successful" });
  });
});

app.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body;
  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) return res.status(401).json({ error: "Failed to create" });

    const data = authdb.get();
    data.push({ username, hashedPassword, salt });
    authdb.set(data);
    res.status(200).json({ message: "Create successful" });
  });
});

// Store Routes
app.get("/stores", (req, res) => {
  const data = db.getStores();
  data ? res.json(data) : res.status(404).json({ error: "Not Found" });
});

app.get("/stores/:store", (req, res) => {
  const data = db.get(req.params.store);
  data ? res.json(data) : res.status(404).json({ error: "Store not found" });
});

app.post("/stores/create", (req, res) => {
  const { storeName, initialItem } = req.body;
  if (storeName && initialItem) {
    initialItem.id = Date.now();
    const success = db.set(storeName, [initialItem]);
    return success ? res.json(success) : res.status(404).json({ error: "Failed to create" });
  }
  res.status(400).json({ error: "Missing data" });
});

app.post("/stores/:store/create", (req, res) => {
  const { store } = req.params;
  const item = req.body;
  if (item) {
    item.id = Date.now();
    const data = db.get(store);
    data.push(item);
    db.set(store, data);
    return res.json(true);
  }
  res.status(400).json({ error: "Missing item" });
});

app.patch("/stores/:store/:id", (req, res) => {
  const { store, id } = req.params;
  const data = db.get(store);
  const index = data.findIndex(item => item.id == id);
  if (index >= 0) {
    data[index] = req.body;
    db.set(store, data);
    return res.json(true);
  }
  res.status(404).json({ error: "Failed to update" });
});

app.patch("/stores/:store", (req, res) => {
  const { store } = req.params;
  const storeData = req.body;
  db.set(store, storeData);
  res.json(true);
});

app.patch("/stores/rename", (req, res) => {
  const { oldName, newName } = req.body;
  if (oldName && newName) {
    db.renameStore(oldName, newName);
    return res.json(true);
  }
  res.status(400).json({ error: "Missing names" });
});

app.post("/stores/delete", (req, res) => {
  const { name } = req.body;
  if (name) {
    db.delete(name);
    return res.json(true);
  }
  res.status(400).json({ error: "Missing name" });
});

app.delete("/stores/:store", (req, res) => {
  db.delete(req.params.store);
  res.json({ message: "Store deleted" });
});

app.delete("/stores/:store/:id", (req, res) => {
  const { store, id } = req.params;
  const data = db.get(store);
  const index = data.findIndex(item => item.id == id);
  if (index >= 0) {
    data.splice(index, 1);
    db.set(store, data);
    return res.json(true);
  }
  res.status(404).json({ error: "Item not found" });
});

app.post("/query", (req, res) => {
  const result = db.find(req.body);
  res.json(result);
});

// TODO: Media upload

app.post('/:store/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded.' });
  }

  const { store } = req.params;
  const fileUrl = `/uploads/${req.file.filename}`;

  console.log(store, fileUrl)

  // TODO: Check the selected database for a file key

  // if none is found create a file store, the file store will not be shown in the dashboard but it will be shown on '/media/`
  return res.status(200).json({ url: fileUrl });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
