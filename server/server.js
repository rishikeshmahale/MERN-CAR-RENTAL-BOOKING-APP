import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js"


const app = express();

const PORT = process.env.PORT || 3000


// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.json({
        message : "WELCOME TO CAR RENTAL WEB APPLICATION !"
    })
})
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on PORT : ${PORT}`)
})
