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

// Passport local strategy
passport.use(new LocalStrategy((username, password, done) => {
  const user = authdb.find(username);
  if (!user) return done(null, false, { message: "Incorrect username or password." });

  const storedSalt = Buffer.from(user.salt);
  crypto.pbkdf2(password, storedSalt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) return done(err);

    const storedPassword = Buffer.from(user.hashedPassword, "hex");
    const match = crypto.timingSafeEqual(storedPassword, hashedPassword);
    return match ? done(null, user) : done(null, false, { error: "Incorrect username or password." });
  });
}));

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, username: user.username }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

// ## AUTH MANAGEMENT ##

// Check session
app.get("/check-session", (req, res) => {
  req.isAuthenticated()
    ? res.json({ user: req.user })
    : res.status(401).json({ error: "Could not authenticate user" });
});

app.post("/sign-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.status(200).json({ message: "User sign-in successful", user });
    });
  })(req, res, next);
});

app.get("/sign-out", (req, res) => {
  req.logOut(err => {
    if (err) return res.status(401).json({ error: "Could not sign-out user" });
    res.json({ message: "User sign-out successful" });
  });
});

app.post("/sign-up", (req, res, next) => {
  const { username, password } = req.body;
  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Could not sign-up user" });

    const data = authdb.get();

    if (data.some(user => user.username === username)) {
      return res.status(409).json({ error: "Username already exists" });
    }

    data.push({ username, hashedPassword: hashedPassword.toString("base64"), salt: salt.toString("base64") });
    authdb.set(data);
    res.status(200).json({ message: "User sign-up successful" });
  });
});

// ## STORE MANAGEMENT ##

// Create a store
app.post("/create-store/:storeName", (req, res) => {
  try {
    const { storeName } = req.params;
    db.set(storeName, []);
    return res.status(200).json({ message: "Store created" });
  } catch (error) {
    res.status(500).json({ error: "Could not create store" });
  }
});

// Get a list of stores
app.get("/get-stores", (req, res) => {
  try {
    const data = db.getStores();
    return res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Could not get stores" });
  }
});

// Rename a store
app.patch("/rename-store/:oldStoreName/:newStoreName", (req, res) => {
  try {
    const { oldStoreName, newStoreName } = req.params;
    db.renameStore(oldStoreName, newStoreName);
    return res.status(200).json({ message: "Store renamed" });
  } catch (error) {
    res.status(500).json({ error: "Could not rename store" });
  }
});

// Delete a store
app.delete("/delete-store/:storeName", (req, res) => {
  try {
    const { storeName } = req.params;
    db.delete(storeName);
    return res.json({ message: "Store deleted" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete store" });
  }
});


// STORE ITEM MANAGEMENT

// Create store item
app.post("/create-store-item/:storeName", (req, res) => {
  try {
    const { storeName } = req.params;
    const item = req.body;
    item.id = Date.now();
    const data = db.get(storeName);
    data.push(item);
    db.set(storeName, data);
    return res.status(201).json({ message: "Item created" });
  } catch (error) {
    res.status(404).json({ error: "Could not create item" });
  }
});

// Get store items
app.get("/get-store-items/:storeName", (req, res) => {
  try {
    const { storeName } = req.params;
    const data = db.filterStoreByObjectKey(storeName, 'mediaType', true)
    return res.status(200).json(data)
  } catch (error) {
    res.status(404).json({ error: "Could not get store items" });
  }
});

// Edit store item
app.patch("/edit-store-item/:storeName", (req, res) => {
  try {
    const { storeName } = req.params;
    const theItem = req.body;
    const data = db.get(storeName);
    const index = data.findIndex(item => item.id == theItem.id);
    if (index === -1) {
      return res.status(404).json({ error: "Could not find item" });
    }
    data[index] = theItem;
    db.set(storeName, data);
    return res.status(201).json({ message: "Item updated" });
  } catch (error) {
    res.status(404).json({ error: "Could not update item" });
  }
});

// Delete store item
app.delete("/delete-store-item/:storeName/:itemId", (req, res) => {
  try {
    const { storeName, itemId } = req.params;
    const data = db.get(storeName);
    const index = data.findIndex(item => item.id == itemId);
    if (index === -1) return res.status(404).json({ error: "Item not found" });
    else if (index !== -1) {
      data.splice(index, 1);
      db.set(storeName, data);
      return res.json({ message: "Item deleted" });
    }
  } catch (error) {
    res.status(404).json({ error: "Could not delete item" });
  }
});

// ## MEDIA ROUTES ##

// Upload media to store
app.post('/upload-media-item/:storeName', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const { storeName } = req.params;
    const fileUrl = `/uploads/${req.file.filename}`;
    const mediaType = req.body['mediaType'];
    // Check if the store exist
    const data = db.get(storeName);
    if (data === null) {
      // Create the store if it does not exist
      db.set(storeName, []);
    }
    const mediaData = {
      id: req.file.filename,
      path: fileUrl,
      name: req.file.originalname,
      mediaType: mediaType,
    }
    data.push(mediaData);
    db.set(storeName, data);
    return res.status(201).json({ message: "Media uploaded" });
  } catch (error) {
    return res.status(400).send({ error: 'Could not upload file' });
  }
});

// Get media media by type
app.get("/get-media-items/:storeName/:mediaType", (req, res) => {
  try {
    const { storeName, mediaType } = req.params;
    const media = db.filterStoreByObjectKeyValue(storeName, 'mediaType', mediaType);
    return res.status(200).json(media);
  } catch (error) {
    return res.status(400).send({ error: 'Could not get media by type' });
  }
});

// Delete media item
app.delete("/delete-media-item/:storeName/:mediaId", (req, res) => {
  try {
    const { storeName, mediaId } = req.params;
    const media = db.filterStoreByObjectKey(storeName, 'mediaType', false);
    const mediaItem = media.find(item => item.id === mediaId);
    if (!mediaItem) {
      return res.status(404).json({ error: "Could not find media item" });
    }
    const storeData = db.get(storeName);
    const updatedStoreData = storeData.filter(item => item.id !== mediaId);
    db.set(storeName, updatedStoreData);
    const filePath = path.join(__dirname, mediaItem['path']);
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not delete media item" });
      }
      return res.status(200).json({ message: "Media item deleted", deletedMedia: mediaItem });
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not delete media item" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
