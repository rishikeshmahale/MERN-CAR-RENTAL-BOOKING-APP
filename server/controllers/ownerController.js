import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";
import uploadOnCloudinary from "../config/cloudinary.js";

// Api to change role
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, {
      role: "owner",
    });

    return res
      .status(200)
      .json({ success: true, message: "Now you can list cars." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error in changeRoleToOwner controller",
      error: error.message,
    });
  }
};

// API to list car
export const addCar = async (req, res) => {
  try {
    // Checking authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const { _id } = req.user;

    // Check car data
    if (!req.body.carData) {
      return res.status(400).json({
        success: false,
        message: "carData is missing",
      });
    }

    let car;

    try {
      car = JSON.parse(req.body.carData);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid carData JSON",
      });
    }

    // Checking uploaded image
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Car image is missing",
      });
    }

    // Upload image to Cloudinary
    const image = await uploadOnCloudinary(imageFile.path);

    if (!image) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    const addedCar = await Car.create({
      ...car,
      owner: _id,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Car Added Successfully",
      addedCar,
    });

  } catch (error) {
    console.error("ADD CAR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


