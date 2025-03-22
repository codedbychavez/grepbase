import express, {Request, Response} from "express";
let cors = require("cors");
import JSONDatabase from "./db";

const app = express();
const db = new JSONDatabase();
app.use(express.json());
app.use(cors());

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
    didUpdate ? res.json(didUpdate) : res.status(404).json({error: "Failed to update"});
})

app.get("/stores/:store", (req: Request, res: Response) => {
    const data = db.get(req.params.store);
    data ? res.json(data) : res.status(404).json({error: "Store not found"});
});

app.post("/query", (req: Request, res: Response) => {
    const result = db.find(req.body);
    res.json(result);
});

app.delete("/stores/:store", (req: Request, res: Response) => {
    db.delete(req.params.store);
    res.json({message: "Data deleted successfully!"});
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});