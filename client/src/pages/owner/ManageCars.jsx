import { useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import Title from "../../components/Title.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const ManageCars = () => {

  const { currency, axios, isOwner, fetchCars, setCars } = useAppContext();

  const [ownerCars, setOwnerCars] = useState([]);

  // fetching owner cars
  const fetchOwnerCars = async () => {
    try {

      const { data } = await axios.get("/api/owner/cars");

      console.log("/api/owner/cars", data);
      console.log("cars :", data.ownerCars);


      if (data.success) {
        setOwnerCars(data.ownerCars);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // toggle the car availability
  const toggleAvailability = async (carId) => {
    try {

      const { data } = await axios.post("/api/owner/toggle-car", {
        carId
      });

      console.log("/api/owner/toggle-car:", data);

      if (data.success) {
        toast.success(data.message);
        await fetchOwnerCars();
        await fetchCars();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {

      const confirm = window.confirm("Are you sure you want to delete this car?");

      if (!confirm) {
        return null;
      }

      const { data } = await axios.post("/api/owner/delete-car", { carId });

      console.log("/api/owner/delete-car:", data);

      if (data.success) {
        toast.success(data.message);

       

        // Immediately remove the deleted car from React state
      setOwnerCars((prevCars) =>
        prevCars.filter((car) => car._id !== carId)
      );
      // fetchOwnerCars();

      setCars((prevCars) => 
      prevCars.filter((car) => car._id !== carId))
      //  await fetchCars();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

  };

  useEffect(() => {

    isOwner && fetchOwnerCars();

  }, [isOwner]);


  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ownerCars?.map((car, index) => (
              <tr key={car._id} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt="icon"
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex items-center p-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt="icon"
                    className="cursor-pointer"
                  />

                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt="icon"
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
