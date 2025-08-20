// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from "react";
import { baseUrl } from "../Config/Urls";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { IoCloseOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
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
  password: Yup.string().when('isUpdate', {
    is: false,
    then: () => Yup.string().required("Password is required"),
    otherwise: () => Yup.string()
  }),
  role: Yup.string().required("Role is required"),
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [errorMSG, setErrorMSG] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Helper function to get authorization token
  const getAuthToken = () => {
    // Try different possible token keys in localStorage
    return localStorage.getItem("authorizationToken") || 
           localStorage.getItem("token") || 
           JSON.parse(localStorage.getItem("user") || '{}')?.accessToken || '';
  };

  // Optimized fetch function with better error handling
  const fetchUserData = useCallback(async (page = currentPage) => {
    const authToken = getAuthToken();
    
    if (!authToken) {
      setError("No authorization token found. Please login again.");
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
            "Authorization": authToken, // Fixed: Use consistent header name
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response: ", result);

      if (result && result.data && Array.isArray(result.data)) {
        setUsers(result.data);
        setTotalPages(result.numOfPages || 1);
        localStorage.setItem("users", JSON.stringify(result.data));
        setError(null);
      } else {
        console.error("Unexpected data format: ", result);
        throw new Error("Unexpected data format from server");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      setError(error.message);
      
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
      isUpdate: false
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      setErrorMSG("");

      try {
        const authToken = getAuthToken();
        
        if (!authToken) {
          setErrorMSG("No authorization token found. Please login again.");
          return;
        }

        if (selectedUser) {
          // Update existing user - Fixed: Use proper form data format
          const formData = new FormData();
          formData.append("name", values.username);
          formData.append("email", values.email);
          formData.append("role", values.role);
          
          // Only include password if it's provided
          if (values.password && values.password.trim()) {
            formData.append("password", values.password);
          }

          const response = await axios.put(
            `${baseUrl}/api/user/${selectedUser.id}`,
            formData, // Fixed: Use FormData instead of JSON
            {
              headers: {
                "Authorization": authToken, // Fixed: Use consistent header
                // Don't set Content-Type, let axios set it for FormData
              },
            }
          );

          if (response.data.status) {
            toast.success("User updated successfully");
            handleModalClose();
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
                "Authorization": authToken, // Fixed: Use consistent header
              },
            }
          );

          if (response.data.status) {
            toast.success("User created successfully");
            handleModalClose();
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

  // Delete user function
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        toast.error("No authorization token found. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${baseUrl}/api/user/${userToDelete.id}`,
        {
          headers: {
            "Authorization": authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || "User deleted successfully");
        setDeleteModalOpen(false);
        setUserToDelete(null);
        
        // Refresh data and adjust pagination if needed
        const newTotalUsers = users.length - 1;
        const newTotalPages = Math.ceil(newTotalUsers / 7);
        
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
          await fetchUserData(newTotalPages);
        } else {
          await fetchUserData(currentPage);
        }
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = useCallback((user) => {
    setSelectedUser(user);
    formik.setValues({
      username: user.name || "",
      email: user.email || "",
      password: "", // Don't pre-fill password for security
      role: user.role || "ADMIN",
      showPassword: false,
      isUpdate: true // Flag to indicate this is an update
    });
    setIsOpen(true);
    setErrorMSG("");
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
    formik.setValues({
      username: "",
      email: "",
      password: "",
      role: "ADMIN",
      showPassword: false,
      isUpdate: false
    });
    setIsOpen(true);
  }, [formik]);

  const handleDeleteClick = useCallback((user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  }, []);

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
                  Actions
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
                    key={user.id}
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
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="font-medium hover:scale-110 transition-transform"
                          title="Edit user"
                        >
                          <LiaUserEditSolid className="w-6 h-6 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)} 
                          className="font-medium hover:scale-110 transition-transform"
                          title="Delete user"
                        >
                          <FaTrashAlt className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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

      {/* Edit/Create Modal */}
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
                      required={!selectedUser}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full flex justify-center items-center bg-[#04040480]"
        >
          <div className="flex w-full items-center my-5 justify-center mx-auto px-5 container">
            <div className="bg-white p-8 rounded-[22px] shadow-md w-full max-w-md">
              <div className="flex relative flex-col gap-5 mb-4 items-center justify-center">
                <div className="w-full cursor-pointer absolute top-0 justify-end flex inset-0">
                  <IoCloseOutline
                    onClick={handleDeleteModalClose}
                    className="h-7 hover:text-[blue] w-7"
                  />
                </div>
                <h2 className="text-xl font-bold text-center text-red-600">
                  Delete User
                </h2>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this user?
                </p>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-red-800">{userToDelete?.name}</p>
                  <p className="text-red-600 text-sm">{userToDelete?.email}</p>
                </div>
                <p className="text-red-600 text-sm mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteModalClose}
                  disabled={deleting}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {deleting ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}   
    </>
  );
}

export default UserList;