import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../components/Loader";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        let carData = dummyCarData.find((car) => car._id === id);

        setCar(carData);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCarDetails();
  }, [id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img
          src={assets.arrow_icon}
          alt="arrow icon"
          className="rotate-180 opacity-65"
        />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left : Car Image & Details  */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt="car image"
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl fot-bold">
                {car.brand} {car.model}
              </h1>
              <p className=" text-gray-500 text-lg">
                {car.category} | {car.year}
              </p>
            </div>
            <hr className="border borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={item.icon} alt="icon" className="h-5 mb-2" />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="check icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT : Booking form  */}
      </div>
    </div>
  ) : (
    <Loader/>
  );
};

export default CarDetails;
