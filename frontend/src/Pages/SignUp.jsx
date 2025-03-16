import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, Smartphone } from "lucide-react";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationError, setvalidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, password } = userInfo;
    if (!name || !email || !phone || !password)
      return "All fields are required.";

    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) return "Invalid phone number format.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";

    if (password.length < 6)
      return "Password must be at least 6 characters long.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setvalidationError(validationError);
      return;
    }

    setvalidationError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      // alert("Signup successful! Please log in.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setvalidationError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <main className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-center mb-4">
          Sign Up for Free
        </h3>

        {validationError && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {validationError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
          />
          <Input
            icon={Smartphone}
            type="tel"
            placeholder="01XXXXXXXXX"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            setPasswordVisible={setPasswordVisible}
            passwordVisible={passwordVisible}
          />

          <motion.button
            className="mt-5 w-full py-3 px-4 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						transition duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader className="mx-auto animate-spin" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="relative flex items-center text-gray-500 my-5">
          <span className="flex-grow bg-gray-300 h-px"></span>
          <span className="mx-2 text-sm">Or sign up with</span>
          <span className="flex-grow bg-gray-300 h-px"></span>
        </div>

        <button className="bg-blue-600 w-full transition hover:bg-blue-700 flex items-center justify-center p-3 rounded-md gap-2 text-white cursor-pointer">
          <img
            src="https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=600&name=image8-2.jpg"
            alt="Google Logo"
            className="size-6 object-cover"
          />
          Sign up with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default SignUp;
