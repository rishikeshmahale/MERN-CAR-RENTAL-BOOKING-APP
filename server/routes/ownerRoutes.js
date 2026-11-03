import express from "express";
import { protect } from "../middleware/auth.js";
import { changeRoleToOwner, addCar } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car",protect, upload.single("image"), addCar);


export default ownerRouter;


// {
//     "brand" : "BMW",
//     "model" : "X5",
//     "year" : 2006,
//     "category" : "SUV",
//     "seating_capacity" : 4,
//     "fuel_type" : "Hybrid",
//     "transmission" : "Semi-Automatic",
//     "pricePerDay" : 300,
//     "location" : "New York",
//     "description" : "The BMW X5 is a mid-size luxury SUV produced by BMW."
// }