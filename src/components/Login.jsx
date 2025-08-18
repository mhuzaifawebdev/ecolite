import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TfiEmail } from "react-icons/tfi";
import { GiPadlock } from "react-icons/gi";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { IoLogInOutline } from "react-icons/io5";
import { baseUrl } from "../Config/Urls";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInRD } from "../Store/Slices/userSlice";
import Spinner from "../components/Spinner";
import {colors} from "../Config/Colors.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMSG("");
    setProcessing(true);
    axios.defaults.headers.common.Authorization = undefined;

    try {
      const payload = {
        email,
        password,
      };

      const response = await axios.post(`${baseUrl}/api/auth/login`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      });

      const resData = response.data;

      if (resData.status) {
        const user = {...resData.data.user};

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUserInRD(user));

        localStorage.setItem("authorizationToken", user.accessToken);
        // Set default auth header
        axios.defaults.headers.common.Authorization = user.accessToken;

        // Navigate based on role
        if (user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setErrorMSG(resData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMSG("Incorrect email or password");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className={`h-screen flex   bg-primary`}
      style={{ boxSizing: "border-box" }}
    >
      <div
        className="w-full    hidden items-center justify-center lg:flex"
        style={{ backgroundImage: "/image/ecolite-logo.webp" }}
        // style={{ backgroundImage: url("../../public/rename.png") }}
      >
        {" "}
        <img
          src="/image/ecolite-logo-removebg.png"
          alt=""
          className="w-60 text-blue-900"
        />
      </div>
      <div className="flex w-full  justify-center items-center">
        <div
          className="bg-white p-5 sm:p-8  rounded-[22px] shadow-md w-full mx-6 sm:mx-[15%] "
          // style={{ marginRight: "15%", marginLeft: "15%" }}
        >
          <div className="flex flex-col gap-5 mb-10 items-center justify-center">
            <img
              src="/image/ecolite-logo.webp"
              alt=""
              className="w-48 text-blue-900"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-center">
              Log in to your Account
            </h2>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className=" relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeField === "email" ? "" : "Email"}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField("")}
                className={`${
                  activeField === "email"
                    ? "w-full text-[18px] font-medium"
                    : "text-[#ADADAD] w-full pl-10 font-normal"
                } w-full px-3 min-h-[50px] border bg-[#F0F0F0] rounded-[12px]`}
              />
              <div
                className={`${
                  activeField === "email" ? "hidden" : "absolute top-4 left-3"
                }`}
              >
                <TfiEmail className="bg-transparent text-[#ADADAD] w-5 h-5" />
              </div>
            </div>
            <div className=" relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeField === "password" ? "" : "Password"}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField("")}
                className={`${
                  activeField === "password"
                    ? "w-full text-[18px] font-medium"
                    : "text-[#ADADAD] w-full pl-10 font-normal"
                } w-full px-3 min-h-[50px] border bg-[#F0F0F0] rounded-[12px]`}
              />
              <div
                className={`${
                  activeField === "password"
                    ? "hidden"
                    : "absolute top-4 left-3"
                }`}
              >
                <GiPadlock className="bg-transparent text-[#ADADAD] w-5 h-5" />
              </div>
              <div
                className="absolute top-4 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="bg-transparent text-[#ADADAD] w-5 h-5" />
                ) : (
                  <AiFillEye className="bg-transparent text-[#ADADAD] w-5 h-5" />
                )}
              </div>
            </div>
            <div className="flex w-full justify-between items-center my-5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="border-[1px] cursor-pointer border-[#E7E7E7] w-6 inline h-6 rounded-[5px] bg-[#F5F5F5]"
                />
                <p className="text-[14px] leading-6 font-normal">Remember me</p>
              </div>
              <div>
                <p className="text-[14px] leading-4 font-medium cursor-pointer text-[#00949E]">
                  Forget Password?
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-buttonsBg  flex items-center gap-5 justify-center font-medium min-h-[50px] text-[18px] leading-6 text-white p-2 duration-300 rounded-full hover:bg-[#EE3844]"
            >
              {" "}
              {processing ? (
                <Spinner />
              ) : (
                <>
                  <IoLogInOutline className="w-7 h-7" />
                  <span className="text-[18px] font-bold leading-6">
                    {" "}
                    Log in
                  </span>
                </>
              )}
            </button>
            {errorMSG && (
              <div className="text-red-500 text-center mt-4">{errorMSG}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
