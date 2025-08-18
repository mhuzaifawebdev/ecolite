import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoCloseOutline, IoLogInOutline } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { UNSAFE_RouteContext, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../Config/Urls";
import { signupUser } from "../actions";
import { fetchUserData } from "../actions"; // Correct import
import axios from "axios";
import Spinner from "./Spinner";
import { MdOutlineAddBox } from "react-icons/md";
import {colors} from "../Config/Colors.js";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().required("Role is required"),
});

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [globalUser, setGlobalUser] = useState();
  const user = location.href.split("?")[1];

  const [processing, setprocessing] = useState(false);
  const [errorMSG, seterrorMSG] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  let temp = {};

  if (user) {
    const userDataList = user?.split("&");
    userDataList.forEach((data) => {
      // formik.setFieldValue(data.split("=")[0], data.split("=")[1]);
      const key = data.split("=")[0];
      const value = data.split("=")[1];
      temp[key] = value;
    });
    console.log(temp);
  }
  const formik = useFormik({
    initialValues: {
      username: temp?.name || "",
      email: temp?.email || "",
      password: "",
      role: temp?.role || "", // Add role field
      showPassword: false,
    },
    validationSchema,
    onSubmit: (values) => {
      setprocessing(true);

      seterrorMSG("");
      const formdata = new FormData();
      formdata.append("email", values.email);
      formdata.append("password", values.password);
      formdata.append("name", values.username);
      formdata.append("role", values.role); // Append role to FormData
      temp?.id && formdata.append("id", temp?.id);
      const header = new Headers();
      let loggedUser = localStorage.getItem("user");
      if (loggedUser) {
        loggedUser = JSON.parse(loggedUser);
      }
      if (loggedUser?.accessToken) {
        header.append("authorization", loggedUser?.accessToken);
      }
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/user/${temp?.id ? "update" : "signup"}`,
        data: formdata,
        headers: header,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          console.log(response.data.data, "RD");
          if (response.data.status) {
            console.log(response.data.data.user, "Success");
            navigate(-1);
          } else {
            console.log(response.data.data.message, "Error");
            seterrorMSG(response?.data?.message);
          }
        })
        .catch((error) => {
          if (!error.response.data.status) {
            console.log(error?.response?.data?.message, "()=>Error");
            seterrorMSG(error?.response?.data?.message);
          } else {
            console.log(error);
            seterrorMSG(error);
          }
        })
        .finally(() => setprocessing(false));
    },
  });

  return (
    <div className="min-h-screen flex items-center py-5 justify-center bg-[#000000]/50">
      <div className="flex w-full items-center my-5 justify-center mx-auto px-5 container">
        <div className="bg-white p-4 rounded-[22px] shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="flex relative flex-col gap-5 mb-2 items-center justify-center">
            <div className="w-full cursor-pointer absolute top-0 justify-end flex inset-0">
              <p>
                <IoCloseOutline
                  onClick={() => navigate("/admin-dashboard")}
                  className="h-7 hover:text-[blue] w-7"
                />
              </p>
            </div>
            {/*<img*/}
            {/*  src="/image/logoOnly.png"*/}
            {/*  alt=""*/}
            {/*  className="w-28 text-blue-900"*/}
            {/*/>*/}
            <h2 className="text-xl sm:text-xl font-bold text-center">
              Create New User
            </h2>
          </div>
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="relative ">
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="Username"
                className={`${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : ""
                } w-full px-3 min-h-[50px] border  -mt-[9px] text- rounded-[12px]`}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-[11px] absolute -bottom-5">
                  {formik.errors.username}
                </div>
              )}
            </div>

            <div className="relative">
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                placeholder="Email"
                className={`${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-[11px] absolute -bottom-5">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="relative">
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>
                Email
              </label>
              <input
                  type={formik.values.showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  placeholder="Password"
                  className={`${  formik.touched.password && formik.errors.password ? "border-red-500" : "" } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
              />
              {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-[11px] absolute -bottom-5">
                    {formik.errors.password}
                  </div>
              )}

              <div
                  className="absolute bottom-4 right-3 cursor-pointer"
                  onClick={() =>
                      formik.setFieldValue(
                          "showPassword",
                          !formik.values.showPassword
                      )
                  }
              >
                {formik.values.showPassword ? (
                    <AiFillEyeInvisible className="bg-transparent text-[#ADADAD] w-5 h-5"/>
                ) : (
                    <AiFillEye className="bg-transparent text-[#ADADAD] w-5 h-5"/>
                )}
              </div>
            </div>

            <div className="relative">
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}> Role </label>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className={`${
                  formik.touched.role && formik.errors.role
                    ? "border-red-500"
                    : ""
                } w-full px-3 min-h-[50px] border  -mt-[9px] text- rounded-[12px]`}
              >
                <option value="">Select Role</option>
                <option value="surveyor">Surveyor</option>
                <option value="poster">Poster</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500 text-[11px] absolute -bottom-5">
                  {formik.errors.role}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-buttonsBg rounded-full my-5 flex items-center gap-2 justify-center font-medium min-h-[50px] text-[18px] leading-6 text-white p-1 duration-300  "
            >
              {processing ? (
                <Spinner />
              ) : (
                <>
                  <MdOutlineAddBox className="w-5 h-5" />

                  <span className="text-[18px]  leading-6">Create User</span>
                </>
              )}
            </button>
          </form>
          {errorMSG && (
            <div className="text-red-500 text-center mt-4">{errorMSG}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;

// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { IoCloseOutline } from "react-icons/io5";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Spinner from "./Spinner";
// import { MdOutlineAddBox } from "react-icons/md";
// import { baseUrl } from "../Config/Urls";

// const validationSchema = Yup.object({
//   username: Yup.string().required("Username is required"),
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string().required("Password is required"),
//   role: Yup.string().required("Role is required"),
// });

// function Register() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const [processing, setProcessing] = useState(false);
//   const [errorMSG, setErrorMSG] = useState("");
//   const [isEdit, setIsEdit] = useState(false); // State to check if it's an edit operation
//   const { loading, error } = useSelector((state) => state.user);

//   // Initial form values
//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       email: "",
//       password: "",
//       role: "",
//       showPassword: false,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setProcessing(true);
//       setErrorMSG("");

//       const formData = new FormData();
//       formData.append("email", values.email);
//       formData.append("password", values.password);
//       formData.append("name", values.username);
//       formData.append("role", values.role);

//       let config = {
//         method: isEdit ? "put" : "post", // Use PUT method for updates
//         maxBodyLength: Infinity,
//         url: isEdit
//           ? `${baseUrl}/api/user/update`
//           : `${baseUrl}/api/user/signup`,
//         data: formData,
//       };

//       try {
//         const response = await axios.request(config);
//         if (response.data.status) {
//           console.log(response.data.data.user, "Success");
//           if (isEdit) {
//             alert("User updated successfully");
//             // Update local storage
//             const updatedUser = {
//               ...response.data.data.user,
//             };
//             localStorage.setItem("user", JSON.stringify(updatedUser));
//           }
//           navigate("/admin-dashboard");
//         } else {
//           setErrorMSG(response.data.data.message);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         setErrorMSG(error?.response?.data?.message || "Error updating user");
//       } finally {
//         setProcessing(false);
//       }
//     },
//   });

//   // If it's an edit operation, set the form values
//   useEffect(() => {
//     if (location.state && location.state.user) {
//       const user = location.state.user;
//       formik.setValues({
//         username: user.name || "",
//         email: user.email || "",
//         password: "", // Password field should be reset
//         role: user.role || "",
//         showPassword: false,
//       });
//       setIsEdit(true); // Set edit mode to true
//     }
//   }, [location.state]);

//   return (
//     <div className="min-h-screen flex items-center py-5 justify-center bg-[#000000]/50">
//       <div className="flex w-full items-center my-5 justify-center mx-auto px-5 container">
//         <div className="bg-white p-4 rounded-[22px] shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
//           <div className="flex relative flex-col gap-5 mb-2 items-center justify-center">
//             <div className="w-full cursor-pointer absolute top-0 justify-end flex inset-0">
//               <IoCloseOutline
//                 onClick={() => navigate("/admin-dashboard")}
//                 className="h-7 hover:text-[blue] w-7"
//               />
//             </div>
//             <img
//               src="/image/logoOnly.png"
//               alt=""
//               className="w-28 text-blue-900"
//             />
//             <h2 className="text-xl sm:text-xl font-bold text-center">
//               {isEdit ? "Edit User" : "Create New User"}
//             </h2>
//           </div>
//           <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
//             <div className="relative">
//               <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-[#0C4D8F] bg-white">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={formik.values.username}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 required
//                 placeholder="Username"
//                 className={`${
//                   formik.touched.username && formik.errors.username
//                     ? "border-red-500"
//                     : ""
//                 } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
//               />
//               {formik.touched.username && formik.errors.username && (
//                 <div className="text-red-500 text-[11px] absolute -bottom-5">
//                   {formik.errors.username}
//                 </div>
//               )}
//             </div>

//             <div className="relative">
//               <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-[#0C4D8F] bg-white">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 required
//                 placeholder="Email"
//                 className={`${
//                   formik.touched.email && formik.errors.email
//                     ? "border-red-500"
//                     : ""
//                 } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <div className="text-red-500 text-[11px] absolute -bottom-5">
//                   {formik.errors.email}
//                 </div>
//               )}
//             </div>

//             <div className="relative">
//               <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-[#0C4D8F] bg-white">
//                 Password
//               </label>
//               <input
//                 type={formik.values.showPassword ? "text" : "password"}
//                 name="password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 required
//                 placeholder="Password"
//                 className={`${
//                   formik.touched.password && formik.errors.password
//                     ? "border-red-500"
//                     : ""
//                 } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <div className="text-red-500 text-[11px] absolute -bottom-5">
//                   {formik.errors.password}
//                 </div>
//               )}
//               <div
//                 className="absolute bottom-4 right-3 cursor-pointer"
//                 onClick={() =>
//                   formik.setFieldValue(
//                     "showPassword",
//                     !formik.values.showPassword
//                   )
//                 }
//               >
//                 {formik.values.showPassword ? (
//                   <AiFillEyeInvisible className="bg-transparent text-[#ADADAD] w-5 h-5" />
//                 ) : (
//                   <AiFillEye className="bg-transparent text-[#ADADAD] w-5 h-5" />
//                 )}
//               </div>
//             </div>

//             <div className="relative">
//               <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-[#0C4D8F] bg-white">
//                 Role
//               </label>
//               <select
//                 name="role"
//                 value={formik.values.role}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 required
//                 className={`${
//                   formik.touched.role && formik.errors.role
//                     ? "border-red-500"
//                     : ""
//                 } w-full px-3 min-h-[50px] border -mt-[9px] text- rounded-[12px]`}
//               >
//                 <option value="">Select Role</option>
//                 <option value="surveyor">Surveyor</option>
//                 <option value="poster">Poster</option>
//               </select>
//               {formik.touched.role && formik.errors.role && (
//                 <div className="text-red-500 text-[11px] absolute -bottom-5">
//                   {formik.errors.role}
//                 </div>
//               )}
//             </div>

//             {errorMSG && (
//               <div className="text-red-500 text-[11px]">{errorMSG}</div>
//             )}

//             <div className="w-full">
//               {processing || loading ? (
//                 <Spinner />
//               ) : (
//                 <button
//                   type="submit"
//                   className="w-full cursor-pointer text-[12px] lg:text-[16px] px-4 py-2 bg-[#003566] rounded-md text-white"
//                 >
//                   {isEdit ? "Update User" : "Create User"}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

