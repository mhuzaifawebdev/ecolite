import React, { useState, useEffect } from "react";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { SlMenu } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import { MdOutlineNotificationsActive } from "react-icons/md";
import store from "../Store";
import { setUserInRD } from "../Store/Slices/userSlice";
import axios from "axios";
import SingleUserSurvey from "../components/SingleUserSurvey";
const UserDashboard = () => {
  const [isActive, setIsActive] = useState("all");

  const handleSearch = (event) => {
    // Implement your search functionality here
  };
  const [userName, setUserName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
    const users = JSON.parse(localStorage.getItem("list")) || [];
    const user = users.find((user) => user.email === loggedInUserEmail);

    if (user) {
      setUserName(user.username);
    } else {
      setUserName(null);
    }
    if (user) {
      const savedProfileImage = localStorage.getItem(
        `profileImage-${user.email}`
      );
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    store.dispatch(setUserInRD(null));
    axios.defaults.headers.common.Authorization = null;
    navigate("/login");
  };

  return (
    <>
      <div className="p-5">
        {/* <div className="w-full sm:min-h-[295px] px-5 pb-24 sm:pb-20 md:pb-10 bg-[#008177]">
           <div className="flex flex-col container mx-auto pt-3 w-full max-w-[1300px]">
            <div className="flex w-full items-center min-h-[49px] justify-between">
              <div className="flex items-center">
                <img
                  src="/image/Group 4 (1).png"
                  alt="Logo"
                  className="w-[30px] h-[30px] text-white"
                />
                <h2 className="text-[20px] font-semibold text-white leading-5 ml-2">
                  Surveyor
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-5">
                <h2
                  onClick={() => navigate("/user-dashboard")}
                  className="text-[16px] font-normal cursor-pointer text-white leading-5"
                >
                  Dashboard
                </h2>
                <h2
                
                className="text-[16px] cursor-pointer font-normal text-white leading-5">
                  Surveys
                </h2>
              </div>
              <div className="md:flex hidden items-center gap-1 justify-end">
                <div className="flex items-center cursor-pointer gap-3 px-3 py-[6px] rounded-[8px] bg-[#285350]">
                  <div
                    className="flex items-center gap-1"
                    onClick={() => navigate("/profile")}
                  >
                    <img
                      src={profileImage || "/image/Avatar.png"}
                      alt="User"
                      className="w-[30px] rounded-full h-[30px] text-white"
                    />
                    <h2 className="text-[14px] font-normal text-white leading-5">
                      {userName}
                    </h2>
                  </div>
                  <span>
                    <MdOutlineNotificationsActive
                      onClick={() => navigate("/notifications")}
                      className="w-6 h-6 text-white cursor-pointer"
                    />
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 flex text-white px-4 py-[7.5px] rounded "
                >
                  Logout
                </button>
              </div>

              <div className="flex md:hidden items-center ">
                <SlMenu
                  onClick={() => setIsActive("sidebar")}
                  className="w-5 h-5  flex  text-white"
                />
              </div>
            </div>
          </div> 
        
         
        </div> */}
        <div className="flex  w-full  ">
           <SingleUserSurvey/>
        </div>
      </div>

      {/* <div
        onClick={() => setIsActive("!sidebar")}
        className={`${
          isActive === "sidebar" ? "translate-x-[0px]  " : "-translate-x-full"
        }  w-full h-screen duration-300 ease-linear bg-black/30 absolute top-0 left-0`}
      >
        <div className="bg-[#008177] h-full p-5 text-white w-80 ">
          <div className="flex items-center">
            <img
              src="/image/Group 4 (1).png"
              alt="Logo"
              className="w-[40px] h-[40px] text-white"
            />
            <h2 className="text-[26px] font-semibold text-white leading-5 ml-2">
              Surveyor
            </h2>
          </div>
          <div className="flex  mt-10  flex-col gap-5">
            <h2
              onClick={() => navigate("/user-dashboard")}
              className=" font-normal text-[20px] cursor-pointer py-3 border-b-[1px] border-[#ffff] text-white leading-5"
            >
              Dashboard
            </h2>
            <h2 className="text-[20px] cursor-pointer py-3 border-b-[1px] border-[#ffff] font-normal text-white leading-5">
              Requests
            </h2>
            <h2
              onClick={() => navigate("/profile")}
              className="text-[20px] cursor-pointer py-3 border-b-[1px] border-[#ffff] font-normal text-white leading-5"
            >
              {" "}
              Go to Profile
            </h2>
            <h2
              onClick={() => navigate("/notifications")}
              className="text-[20px] cursor-pointer py-3 border-b-[1px] border-[#ffff] font-normal text-white leading-5"
            >
              {" "}
              Notification
            </h2>
            <h2
              onClick={handleLogout}
              className="text-[20px] cursor-pointer py-3 border-b-[1px] border-[#ffff] font-normal text-white leading-5"
            >
              {" "}
              Logout
            </h2>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default UserDashboard;
