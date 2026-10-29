import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CarDetails from "./pages/CarDetails.jsx";

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <>
    {
      !isOwnerPath &&
      <Navbar setShowLogin={setShowLogin}/>
    }

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/car-details/:id" element={<CarDetails/>}/>
    </Routes>

    </>
  )
}

export default App;