import { useEffect, useRef, useState } from "react";
import Title from "../../components/Title.jsx";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency, navigate, fetchCars } = useAppContext();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageInputRef = useRef(null);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Allowed dropdown values
  const allowedCategories = ["Sedan", "SUV", "Van"];

  const allowedTransmissions = [
    "Automatic",
    "Manual",
    "Semi-Automatic",
  ];

  const allowedFuelTypes = [
    "Gas",
    "Diesel",
    "Petrol",
    "Electric",
    "Hybrid",
  ];

  const allowedLocations = [
    "New York",
    "Los Angeles",
    "Houston",
    "Chicago",
  ];

  // Image preview handling
  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  // Validate individual fields
  const validateField = (name, value) => {
    const currentYear = new Date().getFullYear();

    switch (name) {

      case "image":
        if (!value) {
          return "Please upload a car image.";
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(value.type)) {
          return "Only JPG, PNG and WEBP images are allowed.";
        }

        if (value.size > 5 * 1024 * 1024) {
          return "Image size must not exceed 5 MB.";
        }

        return "";

      case "brand":
        if (!value.trim()) {
          return "Car brand is required.";
        }

        if (value.trim().length < 2) {
          return "Brand must contain at least 2 characters.";
        }

        if (value.trim().length > 30) {
          return "Brand cannot exceed 30 characters.";
        }

        return "";

      case "model":
        if (!value.trim()) {
          return "Car model is required.";
        }

        if (value.trim().length > 30) {
          return "Model cannot exceed 30 characters.";
        }

        return "";

      case "year":
        if (!value || Number(value) === 0) {
          return "Manufacturing year is required.";
        }

        if (
          !Number.isInteger(Number(value)) ||
          Number(value) < 1900 ||
          Number(value) > currentYear
        ) {
          return `Enter a valid year between 1900 and ${currentYear}.`;
        }

        return "";

      case "pricePerDay":
        if (value === "" || Number(value) <= 0) {
          return "Daily price must be greater than zero.";
        }

        if (!Number.isFinite(Number(value))) {
          return "Please enter a valid price.";
        }

        return "";

      case "category":
        if (!allowedCategories.includes(value)) {
          return "Please select a valid car category.";
        }

        return "";

      case "transmission":
        if (!allowedTransmissions.includes(value)) {
          return "Please select a transmission type.";
        }

        return "";

      case "fuel_type":
        if (!allowedFuelTypes.includes(value)) {
          return "Please select a fuel type.";
        }

        return "";

      case "seating_capacity":
        if (
          !value ||
          !Number.isInteger(Number(value)) ||
          Number(value) < 1 ||
          Number(value) > 15
        ) {
          return "Seating capacity must be between 1 and 15.";
        }

        return "";

      case "location":
        if (!allowedLocations.includes(value)) {
          return "Please select a location.";
        }

        return "";

      case "description":
        if (!value.trim()) {
          return "Description is required.";
        }

        if (value.trim().length < 10) {
          return "Description must contain at least 10 characters.";
        }

        if (value.trim().length > 500) {
          return "Description cannot exceed 500 characters.";
        }

        return "";

      default:
        return "";
    }
  };

  // Handle car input changes
  const handleCarChange = (e) => {
    const { name, value } = e.target;

    setCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));

    // Validate only after a field has been touched
    if (touched[name] || errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    const imageError = validateField("image", selectedImage);

    setTouched((prevTouched) => ({
      ...prevTouched,
      image: true,
    }));

    if (imageError) {
      setImage(null);

      setErrors((prevErrors) => ({
        ...prevErrors,
        image: imageError,
      }));

      e.target.value = "";
      return;
    }

    setImage(selectedImage);

    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
  };

  // Validate entire form before submission
  const validateCarForm = () => {
    const validationErrors = {};

    validationErrors.image = validateField("image", image);

    Object.keys(car).forEach((field) => {
      validationErrors[field] = validateField(field, car[field]);
    });

    return validationErrors;
  };

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const validationErrors = validateCarForm();

    setErrors(validationErrors);

    // Mark all fields as touched
    setTouched({
      image: true,
      brand: true,
      model: true,
      year: true,
      pricePerDay: true,
      category: true,
      transmission: true,
      fuel_type: true,
      seating_capacity: true,
      location: true,
      description: true,
    });

    // Stop submission if validation fails
    if (Object.values(validationErrors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("image", image);

      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      console.log("Car Listing / Car Adding :", data);

      if (data.success) {
        toast.success(data.message);

         // Fetch the latest car list from the backend
        await fetchCars();

        setImage(null);

        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }

        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });

        setErrors({});
        setTouched({});

        setTimeout(() => {
          navigate("/owner");
        }, 2000);

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        noValidate
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >

        {/* Car Image */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={imagePreview || assets.upload_icon}
              alt="upload_icon"
              className="h-14 rounded cursor-pointer"
            />

            <input
              ref={imageInputRef}
              type="file"
              id="car-image"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleImageChange}
            />
          </label>

          <div>
            <p className="text-sm text-gray-500">
              Upload a picture of your car
            </p>

            {errors.image && (
              <p className="text-red-500 text-xs mt-1">
                {errors.image}
              </p>
            )}
          </div>
        </div>

        {/* Car Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col w-full">
            <label>Brand</label>

            <input
              type="text"
              name="brand"
              placeholder="e.g. BMW, Mercedes, Audi..."
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={handleCarChange}
              onBlur={handleBlur}
            />

            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label>Model</label>

            <input
              type="text"
              name="model"
              placeholder="e.g. X5, E-Class, M4..."
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={handleCarChange}
              onBlur={handleBlur}
            />

            {errors.model && (
              <p className="text-red-500 text-xs mt-1">
                {errors.model}
              </p>
            )}
          </div>

        </div>

        {/* Car Year, Price, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="flex flex-col w-full">
            <label>Year</label>

            <input
              type="number"
              name="year"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="2025"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={handleCarChange}
              onBlur={handleBlur}
            />

            {errors.year && (
              <p className="text-red-500 text-xs mt-1">
                {errors.year}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>

            <input
              type="number"
              name="pricePerDay"
              min="0.01"
              step="any"
              placeholder="100"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={handleCarChange}
              onBlur={handleBlur}
            />

            {errors.pricePerDay && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pricePerDay}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label>Category</label>

            <select
              name="category"
              onChange={handleCarChange}
              onBlur={handleBlur}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category}
              </p>
            )}
          </div>

        </div>

        {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="flex flex-col w-full">
            <label>Transmission</label>

            <select
              name="transmission"
              onChange={handleCarChange}
              onBlur={handleBlur}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>

            {errors.transmission && (
              <p className="text-red-500 text-xs mt-1">
                {errors.transmission}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label>Fuel Type</label>

            <select
              name="fuel_type"
              onChange={handleCarChange}
              onBlur={handleBlur}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {errors.fuel_type && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fuel_type}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>

            <input
              type="number"
              name="seating_capacity"
              min="1"
              max="15"
              step="1"
              placeholder="4"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={handleCarChange}
              onBlur={handleBlur}
            />

            {errors.seating_capacity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.seating_capacity}
              </p>
            )}
          </div>

        </div>

        {/* Car Location */}
        <div className="flex flex-col w-full">
          <label>Location</label>

          <select
            name="location"
            onChange={handleCarChange}
            onBlur={handleBlur}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select a location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
          </select>

          {errors.location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location}
            </p>
          )}
        </div>

        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>

          <textarea
            name="description"
            rows={5}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={handleCarChange}
            onBlur={handleBlur}
          ></textarea>

          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <img src={assets.tick_icon} alt="icon" />
          {isLoading ? "Listing..." : "List Your Car"}
        </button>

      </form>
    </div>
  );
};

export default AddCar;