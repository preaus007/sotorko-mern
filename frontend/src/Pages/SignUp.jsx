import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      userInfo.name === "" ||
      userInfo.email === "" ||
      userInfo.phone === "" ||
      userInfo.password === ""
    ) {
      alert("Please fill all the fields");
    } else {
      try {
        console.log(userInfo);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="h-screen mx-auto flex items-center justify-center bg-slate-200 p-4">
      <main className="mx-auto px-10 bg-white rounded-lg">
        <h3 className="text-3xl font-bold text-center my-4">
          Sign up for free
        </h3>

        <form>
          <div className="">
            <label htmlFor="fullName" className="text-md">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="Eg. Mary Olhson"
              className="w-full border border-gray-300 p-2 rounded-md my-2 outline-none italic"
              required
            />
          </div>
          <div className="">
            <label htmlFor="email" className="text-md">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="your@gmail.com"
              className="w-full border border-gray-300 p-2 rounded-md my-2 outline-none italic"
              required
            />
          </div>
          <div className="">
            <label htmlFor="phone" className="text-md">
              Phone number
            </label>
            <input
              type="phone"
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full border border-gray-300 p-2 rounded-md my-2 outline-none italic"
              required
            />
          </div>
          <div className="">
            <label htmlFor="password" className="text-md">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md my-2 outline-none"
                required
              />
              <span
                onClick={(e) => setPasswordVisible(!passwordVisible)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-xl max-w-[380px] w-full transition duration-300 ease-in-out mx-auto shadow-md hover:bg-green-700 flex items-center justify-center p-2 rounded-md text-white cursor-pointer my-4"
            onClick={handleSubmit}
          >
            Get Started
          </button>
        </form>

        <section className="relative flex items-center text-gray-500 my-5 before:content-[''] before:flex-grow before:h-px before:bg-gray-500 before:mx-2 after:content-[''] after:flex-grow after:h-px after:bg-gray-500 after:mx-2">
          <span className="">Or sign up with email</span>
        </section>

        <button className="bg-[#5B86E6] text-xl max-w-[380px] w-full transition duration-300 ease-in-out mx-auto shadow-md hover:bg-[#4A7BD7] flex items-center justify-center p-2 rounded-md gap-2 text-white cursor-pointer my-4">
          <img
            src="https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=600&name=image8-2.jpg"
            alt="Google Logo"
            className="h-[32px] w-[32px] object-cover rounded-md"
          />
          Sign up with Google
        </button>

        <p className="text-center hover:underline cursor-pointer pb-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default SignUp;
