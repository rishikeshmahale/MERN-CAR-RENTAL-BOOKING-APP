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

// Api to list owner cars
export const getOwnerCars = async (req, res) => {
  try {
    // Checking authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const { _id } = req.user;

    const ownerCars = await Car.find({ owner: _id });

    if (ownerCars.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Owner has no cars!" });
    }

    return res.status(200).json({ success: true, ownerCars });
  } catch (error) {
    console.error("GET OWNER CARS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;

    const { carId } = req.body;

    const car = await Car.findById(carId);

    // checking if the car belongs to user
    if (car.owner.toString() !== _id.toString()) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;

    await car.save();

    return res
      .status(200)
      .json({ success: true, message: "Availablity toggled." });
  } catch (error) {
    console.error("Toggle car availability ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;

    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (car.owner.toString() !== _id.toString()) {
      return res.status(404).json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;

    await car.save();

    return res.status(200).json({ success: false, message: "Car Removed." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // Calculate monthlyRevenue from bookings where status is confirmed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to update user image

export const updateUserImage = async (req, res) => {
  try {

    // Checking authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    const { _id } = req.user;

    const imageFile = req.file;
    
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image is missing",
      });
    }

    const image = await uploadOnCloudinary(imageFile.path);

    await User.findByIdAndUpdate(_id, { image });

    return res.status(200).json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
