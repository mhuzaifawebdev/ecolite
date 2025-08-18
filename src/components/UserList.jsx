// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from "react";
import { baseUrl } from "../Config/Urls";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { IoCloseOutline } from "react-icons/io5";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().required("Role is required"),
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [errorMSG, setErrorMSG] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Optimized fetch function with better error handling
  const fetchUserData = useCallback(async (page = currentPage) => {
    const authorizationToken = localStorage.getItem("authorizationToken");
    
    if (!authorizationToken) {
      setError("No authorization token found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseUrl}/api/user/getAllUsers?page=${page}&limit=7`,
        {
          method: "GET",
          headers: {
            "Authorization": authorizationToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response: ", result);

      if (result && result.data && Array.isArray(result.data)) {
        setUsers(result.data);
        setTotalPages(result.numOfPages || 1);
        // Update localStorage with fresh data
        localStorage.setItem("users", JSON.stringify(result.data));
        setError(null);
      } else {
        console.error("Unexpected data format: ", result);
        throw new Error("Unexpected data format from server");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      setError(error.message);
      
      // Only use localStorage as fallback if we have no current data
      if (users.length === 0) {
        const localStorageData = localStorage.getItem("users");
        if (localStorageData) {
          try {
            setUsers(JSON.parse(localStorageData));
          } catch (parseError) {
            console.error("Error parsing localStorage data:", parseError);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, users.length]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData(currentPage);
  }, [currentPage]);

  // Optimized page change handler
  const handlePageChange = useCallback((newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [currentPage, totalPages]);

  // Optimized search with debouncing effect
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Enhanced form submission with automatic refresh
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "ADMIN",
      showPassword: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      setErrorMSG("");

      try {
        if (selectedUser) {
          // Update existing user
          const updateData = {
            name: values.username,
            email: values.email,
            role: values.role,
            ...(values.password && { password: values.password }),
          };

          const response = await axios.put(
            `${baseUrl}/api/user/updateUser/${selectedUser._id}`,
            updateData,
            {
              headers: {
                "Authorization": localStorage.getItem("authorizationToken"),
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.status) {
            toast.success("User updated successfully");
            handleModalClose();
            // Refresh data without changing page
            await fetchUserData(currentPage);
          } else {
            setErrorMSG(response.data.message || "Failed to update user");
          }
        } else {
          // Create new user
          const formData = new FormData();
          formData.append("email", values.email);
          formData.append("password", values.password);
          formData.append("name", values.username);
          formData.append("role", values.role);

          const response = await axios.post(
            `${baseUrl}/api/auth/signup`,
            formData,
            {
              headers: {
                "Authorization": localStorage.getItem("authorizationToken"),
              },
            }
          );

          if (response.data.status) {
            toast.success("User created successfully");
            handleModalClose();
            // Refresh data and possibly go to first page to see new user
            setCurrentPage(1);
            await fetchUserData(1);
          } else {
            setErrorMSG(response.data.message || "Failed to create user");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        const errorMessage = error.response?.data?.message || error.message || "An error occurred";
        setErrorMSG(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEditClick = useCallback((user) => {
    setSelectedUser(user);
    formik.setValues({
      username: user.name || "",
      email: user.email || "",
      password: "", // Don't pre-fill password for security
      role: user.role || "ADMIN",
      showPassword: false,
    });
    setIsOpen(true);
    setErrorMSG(""); // Clear any previous errors
  }, [formik]);

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
    setSelectedUser(null);
    setErrorMSG("");
    formik.resetForm();
  }, [formik]);

  const handleAddNewUser = useCallback(() => {
    setSelectedUser(null);
    setErrorMSG("");
    formik.resetForm();
    setIsOpen(true);
  }, [formik]);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    fetchUserData(currentPage);
  }, [fetchUserData, currentPage]);

  return (
    <>
      <div className="w-full">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center justify-between">
              <span>Error: {error}</span>
              <button
                onClick={handleRefresh}
                className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col flex-1 justify-between bg-[#f5f5f5] pb-5 sm:flex-row items-center gap-5">
          <div className="relative w-full sm:w-[65%] md:w-[75%]">
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 border rounded-full bg-white text-gray-700"
              placeholder="Search users..."
            />
            <IoIosSearch className="w-6 h-6 absolute top-2 left-2 text-gray-500" />
          </div>
          <div
            onClick={handleAddNewUser}
            className="cursor-pointer bg-[#EE3844] md:py-3 py-2 lg:py-2 w-full sm:w-[35%] flex items-center justify-center gap-2 px-2 border rounded-full hover:bg-[#d63240] transition-colors"
          >
            <IoMdAdd className="lg:w-5 w-4 h-4 lg:h-5 text-white" />
            <p className="font-medium sm:text-[12px] md:text-sm lg:text-lg text-white">
              Add New User
            </p>
          </div>
        </div>

        <div className="relative bg-white overflow-x-auto shadow-md rounded-lg">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EE3844]"></div>
                <span>Loading...</span>
              </div>
            </div>
          )}
          
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-[#ffff] py-3 uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-5">
                  UserName
                </th>
                <th scope="col" className="px-6 py-5">
                  Email
                </th>
                <th scope="col" className="px-6 py-5">
                  Role
                </th>
                <th scope="col" className="px-6 py-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {loading ? "Loading users..." : 
                     searchQuery ? "No users found matching your search." : 
                     "No users found."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="bg-white border-b hover:bg-gray-50 transition-colors"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {user.name}
                    </th>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'POSTER' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center items-center">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="font-medium hover:scale-110 transition-transform"
                        title="Edit user"
                      >
                        <LiaUserEditSolid className="w-6 h-6 text-buttonsBg" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-10 py-10">
            {currentPage > 1 && (
              <MdArrowBackIosNew
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer text-primary w-5 h-5 hover:scale-110 transition-transform"
              />
            )}
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === index + 1
                      ? "bg-[#EE3844] text-white font-bold"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            {currentPage < totalPages && (
              <MdArrowForwardIos
                onClick={() => handlePageChange(currentPage + 1)}
                className="cursor-pointer text-primary w-5 h-5 hover:scale-110 transition-transform"
              />
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          id="modal"
          tabIndex="-1"
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full flex justify-center items-center bg-[#04040480]"
        >
          <div className="flex w-full items-center my-5 justify-center mx-auto px-5 container">
            <div className="bg-white p-8 rounded-[22px] shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
              <div className="flex relative flex-col gap-5 mb-2 items-center justify-center">
                <div className="w-full cursor-pointer absolute top-0 justify-end flex inset-0">
                  <p>
                    <IoCloseOutline
                      onClick={handleModalClose}
                      className="h-7 hover:text-[blue] w-7"
                    />
                  </p>
                </div>
                <h2 className="text-xl sm:text-xl font-bold text-center">
                  {selectedUser ? "Update" : "Create New"} User
                </h2>
              </div>
              
              <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                <div className="relative">
                  <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white">
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
                    disabled={submitting}
                    className={`${
                      formik.touched.username && formik.errors.username
                        ? "border-red-500"
                        : ""
                    } w-full px-3 min-h-[50px] border -mt-[9px] rounded-[12px] disabled:bg-gray-50`}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-[11px] absolute -bottom-5">
                      {formik.errors.username}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white">
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
                    disabled={submitting}
                    className={`${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : ""
                    } w-full px-3 min-h-[50px] border -mt-[9px] rounded-[12px] disabled:bg-gray-50`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-[11px] absolute -bottom-5">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block max-w-max text-[16px] leading-5 z-50 relative ml-3 font-medium text-primary bg-white">
                    Password {selectedUser && "(leave blank to keep current)"}
                  </label>
                  <div className="relative">
                    <input
                      type={formik.values.showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required={!selectedUser} // Only required for new users
                      placeholder="Password"
                      disabled={submitting}
                      className={`${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : ""
                      } w-full px-3 min-h-[50px] border -mt-[9px] rounded-[12px] disabled:bg-gray-50`}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                      onClick={() =>
                        formik.setFieldValue(
                          "showPassword",
                          !formik.values.showPassword
                        )
                      }
                    >
                      {formik.values.showPassword ? (
                        <AiFillEyeInvisible className="text-gray-600" />
                      ) : (
                        <AiFillEye className="text-gray-600" />
                      )}
                    </div>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-[11px] absolute -bottom-5">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    disabled={submitting}
                    className={`${
                      formik.touched.role && formik.errors.role
                        ? "border-red-500"
                        : ""
                    } w-full px-3 min-h-[50px] border -mt-[9px] rounded-[12px] disabled:bg-gray-50`}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="POSTER">Poster</option>
                    <option value="SURVEYOR">Surveyor</option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-500 text-[11px] absolute -bottom-5">
                      {formik.errors.role}
                    </div>
                  )}
                </div>

                {errorMSG && (
                  <div className="text-red-500 text-[12px] text-center bg-red-50 p-2 rounded">
                    {errorMSG}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !formik.isValid}
                  className="bg-primary text-white py-3 rounded-full mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitting 
                    ? (selectedUser ? "Updating..." : "Creating...")
                    : (selectedUser ? "Update User" : "Create User")
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserList;