import express, {Request, Response} from "express";
let cors = require("cors");
import JSONDatabase from "./db";

const app = express();
const db = new JSONDatabase();
app.use(express.json());
app.use(cors());

app.get("/store/keys", (req: Request, res: Response) => {
    const data = db.getKeys();
    data ? res.json(data) : res.status(404).json({ error: "Not Found" });
})

app.post("/store/:key", (req: Request, res: Response) => {
    const data = db.get(req.params.key);
    data ? res.json(data) : res.status(404).json({error: "Key not found"});
})

app.get("/store/:key", (req: Request, res: Response) => {
    const data = db.get(req.params.key);
    data ? res.json(data) : res.status(404).json({error: "Key not found"});
});

app.post("/query", (req: Request, res: Response) => {
    const result = db.find(req.body);
    res.json(result);
});

app.delete("/store/:key", (req: Request, res: Response) => {
    db.delete(req.params.key);
    res.json({message: "Data deleted successfully!"});
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});