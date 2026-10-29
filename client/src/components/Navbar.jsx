// import { useState } from "react";
// import { assets, menuLinks } from "../assets/assets.js";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const Navbar = ({ setShowLogin }) => {
//   const location = useLocation();

//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div
//       className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative translation-all ${location.pathname === "/" && "bg-light"}`}
//     >
//       <Link to={"/"}>
//         <img src={assets.logo} alt="logo" className="h-8" />
//       </Link>

//       <div
//         className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-short sm:items-center gap-4 sm:gap-8 max-sm:flex-row transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
//       >
//         {menuLinks.map((link, index) => (
//           <Link key={index} to={link.path}>
//             {link.name}
//           </Link>
//         ))}

//         <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
//           <input
//             type="text"
//             className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
//             placeholder="Search Products"
//           />
//           <img src={assets.search_icon} alt="search" />
//         </div>

//         <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
//           <button onClick={() => navigate("/owner")} className="cursor-pointer">
//             Dashboard
//           </button>
//           <button
//             onClick={() => setShowLogin(true)}
//             className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
//           >
//             Login
//           </button>
//         </div>
//       </div>

//       <button
//         className="sm:hidden cursor-pointer"
//         aria-label="Menu"
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         <img src={open ? assets.close_icon : assets.menu_icon} alt="icons" />
//       </button>
//     </div>
//   );
// };

// export default Navbar;




import { useState } from "react";
import { assets, menuLinks } from "../assets/assets.js";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-light" : ""
      }`}
    >
      <Link to="/" onClick={() => setOpen(false)}>
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:inset-x-0 max-sm:top-16 max-sm:h-[calc(100vh-4rem)] max-sm:w-full max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 transition-all duration-300 z-50 ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${
          open
            ? "max-sm:translate-x-0"
            : "max-sm:translate-x-full"
        }`}
      >
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={() => setOpen(false)}
            className="max-sm:w-full max-sm:px-6 max-sm:py-2"
          >
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search Products"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6 max-sm:px-6">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/owner");
            }}
            className="cursor-pointer"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              setOpen(false);
              setShowLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            Login
          </button>
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={open ? assets.close_icon : assets.menu_icon}
          alt="icons"
        />
      </button>
    </div>
  );
};

export default Navbar;
