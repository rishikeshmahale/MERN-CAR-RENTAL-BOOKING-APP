import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Name validation (registration only)
    if (state === "register") {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else if (name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters";
      }
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      state === "register" &&
      password.length < 8
    ) {
      newErrors.password = "Password must contain at least 8 characters";
    } else if (
      state === "register" &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])/.test(password)
    ) {
      newErrors.password =
        "Include uppercase, lowercase, number and special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Stop submission if validation fails
    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (data.success) {
        navigate("/");
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);

        toast.success(`${state} successful.`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Clear individual field error when user starts correcting it
  const handleChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Toggle between login and registration
  const toggleState = (newState) => {
    setState(newState);
    setErrors({});
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        noValidate
        className="relative flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black cursor-pointer"
          aria-label="Close login popup"
        >
          &times;
        </button>

        {/* Heading */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name Field */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => handleChange("name", e.target.value)}
              value={name}
              placeholder="Enter your name"
              className={`border rounded w-full p-2 mt-1 outline-primary ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              type="text"
              autoComplete="name"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => handleChange("email", e.target.value)}
            value={email}
            placeholder="Enter your email"
            className={`border rounded w-full p-2 mt-1 outline-primary ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            type="email"
            autoComplete="email"
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => handleChange("password", e.target.value)}
            value={password}
            placeholder="Enter your password"
            className={`border rounded w-full p-2 mt-1 outline-primary ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
            type="password"
            autoComplete={
              state === "login" ? "current-password" : "new-password"
            }
          />

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Login / Register Toggle */}
        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => toggleState("login")}
              className="text-primary cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => toggleState("register")}
              className="text-primary cursor-pointer"
            >
              Register here
            </span>
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
