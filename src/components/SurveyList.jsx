import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../Config/Urls";
import { AiOutlineUser } from "react-icons/ai";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { MdMoreVert } from "react-icons/md";
import { Menu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { IoIosSearch, IoMdAdd } from "react-icons/io";

// Fixed filters object with API-compatible keys
const filters = {
  all: {
    color: "white",
    bg: "#6B7280",
    name: "All",
    id: "all",
  },
  NEW: {
    color: "white",
    bg: "#357832",
    name: "New",
    id: "NEW",
  },
  INPROGRESS: {
    color: "#CDBA0B",
    bg: "#FFFCE2",
    name: "In Progress",
    id: "INPROGRESS",
  },
  PENDING: {
    color: "#1BB4BE",
    bg: "#E4F2F4",
    name: "Pending",
    id: "PENDING",
  },
  ACCEPTED: {
    color: "white",
    bg: "#10B981",
    name: "Accepted",
    id: "ACCEPTED",
  },
  COMPLETED: {
    color: "white",
    bg: "#059669",
    name: "Completed",
    id: "COMPLETED",
  },
  REJECTED: {
    color: "white",
    bg: "#EF4444",
    name: "Rejected",
    id: "REJECTED",
  },
};

// Fixed filter function to handle API status values
const filterSurveys = (surveys, statusFilter, searchQuery) => {
  return surveys
    .filter(
      (survey) => {
        if (statusFilter === "all") return true;
        // Map UI filter to API status
        const statusMap = {
          "new": "NEW",
          "inprogress": "INPROGRESS", 
          "pending": "PENDING",
          "accepted": "ACCEPTED",
          "completed": "COMPLETED",
          "rejected": "REJECTED"
        };
        const apiStatus = statusMap[statusFilter] || statusFilter.toUpperCase();
        return survey.status === apiStatus;
      }
    )
    .filter(
      (survey) =>
        survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    if (userFromStorage) {
      setUser(userFromStorage);
      setToken(userFromStorage.accessToken);
    }
  }, []);

  const fetchSurveys = async (page = 1) => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    setLoading(true);
    const authorizationToken = `${token}`;
    let url = `${baseUrl}/api/jobs?page=${page}&limit=7`;

    if (user.role === "ADMIN") {
      url += `&all=true`;
    } else {
      url += `&userId=${user.id}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          authorization: authorizationToken,
        },
      });
      const result = response.data;

      if (result.status && Array.isArray(result.data)) {
        setSurveys(result.data);
        setTotalPages(result.numOfPages || 1);
        setError(null);
      } else {
        setError("Invalid data format");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchSurveys(currentPage);
    }
  }, [token, currentPage, user]);

  // Optimized handleStatusChange function
  const handleStatusChange = async (surveyId, newStatus) => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    if (user.role !== "ADMIN") {
      setError("You are not authorized to change the status.");
      return;
    }

    // Store the previous state for rollback if needed
    const previousSurveys = [...surveys];

    // Optimistic update - update UI immediately
    setSurveys(prevSurveys => 
      prevSurveys.map(survey => 
        survey.id === surveyId 
          ? { ...survey, status: newStatus } 
          : survey
      )
    );

    try {
      const authorizationToken = `${token}`;
      const url = `${baseUrl}/api/jobs/changeStatus`;
      
      const data = {
        id: surveyId,
        status: newStatus
      };

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          authorization: authorizationToken,
        },
      });

      // If successful, clear any previous errors
      if (response.data.status) {
        setError(null);
      } else {
        // Rollback on failure
        setSurveys(previousSurveys);
        setError(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status change error:", error);
      // Rollback on error
      setSurveys(previousSurveys);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleSurveyClick = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const handleDelete = async (surveyId, index) => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const authorizationToken = `${token}`;
      const url = `${baseUrl}/api/jobs/${surveyId}`;
      
      await axios.delete(url, {
        headers: {
          authorization: authorizationToken,
        },
      });

      // Remove from local state
      const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
      setSurveys(updatedSurveys);
      setError(null);
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const calculateTimeSinceCreation = (createdTime) => {
    const now = new Date();
    const createdDate = new Date(createdTime);
    const differenceInMillis = now - createdDate;
    const differenceInHours = differenceInMillis / 3600000;
    const differenceInDays = differenceInMillis / (1000 * 3600 * 24);

    if (differenceInDays >= 1) {
      return `${Math.floor(differenceInDays)} days ago`;
    } else if (differenceInHours >= 1) {
      return `${Math.floor(differenceInHours)} hours ago`;
    } else {
      return `${Math.floor(differenceInMillis / 60000)} minutes ago`;
    }
  };

  // Helper function to get filter info safely
  const getFilterInfo = (status) => {
    const statusKey = status?.toUpperCase();
    return filters[statusKey] || filters.PENDING; // fallback to pending
  };

  // Filtered surveys based on selected status
  const filteredSurveys = filterSurveys(surveys, statusFilter, searchQuery);

  return (
    <>
      <div className="w-full p-5 overflow-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-col flex gap-5 w-full">
          <div className="flex flex-col flex-1 justify-between bg-[#f5f5f5] sm:flex-row items-center gap-5">
            <div className="relative w-full sm:w-[65%] md:w-[75%]">
              <input
                id="searchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-10 py-2 border rounded-full bg-white text-gray-700"
                placeholder="Search"
              />
              <IoIosSearch className="w-6 h-6 absolute top-2 left-2 text-gray-500" />
            </div>
            <div
              onClick={() => navigate("/add-survey/:userId")}
              className="cursor-pointer bg-[#ff1a30] md:py-3 py-2 lg:py-2 w-full sm:w-[35%] flex items-center justify-center gap-2 px-2 border rounded-full"
            >
              <IoMdAdd className="lg:w-5 w-4 h-4 lg:h-5 text-white" />
              <p className="font-medium sm:text-[12px] md:text-sm lg:text-lg text-white">Add New Survey</p>
            </div>
          </div>

          <div className="flex lg:items-center mb-5 min-h-[44px] md:rounded-full flex-wrap p-1 bg-[#EAF0FF] max-w-max">
            <button
              onClick={() => setStatusFilter("all")}
              className={`${
                statusFilter === "all"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-8 py-[10px] text-[16px] leading-5 font-medium`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("new")}
              className={`${
                statusFilter === "new"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter("inprogress")}
              className={`${
                statusFilter === "inprogress"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              Inprogress
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`${
                statusFilter === "pending"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`${
                statusFilter === "completed"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter("accepted")}
              className={`${
                statusFilter === "accepted"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`${
                statusFilter === "rejected"
                  ? "bg-primary text-white"
                  : "text-primary"
              } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4">
            <p>Loading...</p>
          </div>
        )}

        {/* Table View */}
        <div className="relative xl:flex hidden overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-[#ffff] py-3 uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-5">Title</th>
                <th scope="col" className="px-6 py-5">Location</th>
                <th scope="col" className="px-6 py-5">Name</th>
                <th scope="col" className="px-6 py-5">Phone</th>
                <th scope="col" className="px-6 py-5">Availability</th>
                <th scope="col" className="px-6 py-5">Description</th>
                <th scope="col" className="px-6 py-5">Status</th>
                <th scope="col" className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSurveys.map((survey, index) => {
                const filterInfo = getFilterInfo(survey.status);
                return (
                  <tr key={survey.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {survey.title}
                    </th>
                    <td className="px-6 py-4">{survey.location}</td>
                    <td className="px-6 py-4">{survey.name}</td>
                    <td className="px-6 py-4">{survey.phone}</td>
                    <td className="px-6 py-4">
                      {survey?.date
                        ? new Date(survey.date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                        : "No date available"}
                    </td>
                    <td className="px-6 py-4">{survey.description}</td>
                    <td className="px-6 py-4">
                      {user?.role === "ADMIN" ? (
                        <Menu
                          menuButton={
                            <p
                              className="rounded-md px-3 py-1 max-w-max cursor-pointer transition-all duration-200 hover:opacity-80"
                              style={{
                                backgroundColor: filterInfo.bg,
                                color: filterInfo.color,
                              }}
                            >
                              {filterInfo.name || "N/A"}
                            </p>
                          }
                          transition
                        >
                          <MenuItem onClick={() => handleStatusChange(survey.id, "NEW")}>New</MenuItem>
                          <MenuItem onClick={() => handleStatusChange(survey.id, "INPROGRESS")}>In Progress</MenuItem>
                          <MenuItem onClick={() => handleStatusChange(survey.id, "PENDING")}>Pending</MenuItem>
                          <MenuItem onClick={() => handleStatusChange(survey.id, "ACCEPTED")}>Accepted</MenuItem>
                          <MenuItem onClick={() => handleStatusChange(survey.id, "COMPLETED")}>Completed</MenuItem>
                          <MenuItem onClick={() => handleStatusChange(survey.id, "REJECTED")}>Rejected</MenuItem>
                        </Menu>
                      ) : (
                        <p
                          className="rounded-md px-3 py-1 max-w-max transition-all duration-200"
                          style={{
                            backgroundColor: filterInfo.bg,
                            color: filterInfo.color,
                          }}
                        >
                          {filterInfo.name || "N/A"}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex text-left">
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <Menu
                            menuButton={
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "0",
                                  margin: "0",
                                }}
                              >
                                <MdMoreVert size={30} color="#000" />
                              </button>
                            }
                            transition
                          >
                            <MenuItem onClick={() => handleSurveyClick(survey.id)}>View</MenuItem>
                            <MenuItem onClick={() => handleDelete(survey.id, index)}>Delete</MenuItem>
                          </Menu>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card View */}
        <div className="xl:hidden max-w-[1300px] w-full mx-auto container grid md:grid-cols-3 sm:grid-cols-2 gap-5 transition-all duration-300">
          {filteredSurveys.map((survey, index) => {
            const filterInfo = getFilterInfo(survey.status);
            return (
              <div key={survey.id} className="flex flex-col min-h-full mx-auto justify-between items-stretch gap-3 p-3 bg-white max-w-[335px] w-full rounded-[6px] transition-all duration-200 hover:shadow-lg">
                <div className="w-full items-center flex justify-between">
                  <p className="text-[#767676] leading-4 text-[12px]">
                    Posted {calculateTimeSinceCreation(survey.createdAt)}
                  </p>
                  <span className="transition-all duration-200 hover:scale-110 cursor-pointer">
                    <CiHeart className="w-7 h-7" />
                  </span>
                </div>
                <p className="flex text-[20px] leading-6 font-semibold">{survey.title}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#6E4A58] p-2 rounded-lg">
                      <CiLocationOn className="text-white" />
                    </div>
                    <p className="text-sm">{survey.location}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#5B9B77] p-2 rounded-lg">
                      <AiOutlineUser className="text-white" />
                    </div>
                    <p className="text-sm">{survey.name}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="bg-[#B58C5F] p-2 rounded-lg">
                      <LuPhone className="text-white" />
                    </div>
                    <p className="text-sm">{survey.phone}</p>
                  </div>
                </div>
                
                {user?.role === "ADMIN" ? (
                  <Menu
                    menuButton={
                      <button
                        className="mt-2 px-4 cursor-pointer py-2 text-white rounded transition-all duration-200 hover:opacity-80 transform hover:scale-105"
                        style={{
                          backgroundColor: filterInfo.bg,
                        }}
                      >
                        {filterInfo.name}
                      </button>
                    }
                    transition
                  >
                    <MenuItem onClick={() => handleStatusChange(survey.id, "NEW")}>New</MenuItem>
                    <MenuItem onClick={() => handleStatusChange(survey.id, "INPROGRESS")}>In Progress</MenuItem>
                    <MenuItem onClick={() => handleStatusChange(survey.id, "PENDING")}>Pending</MenuItem>
                    <MenuItem onClick={() => handleStatusChange(survey.id, "ACCEPTED")}>Accepted</MenuItem>
                    <MenuItem onClick={() => handleStatusChange(survey.id, "COMPLETED")}>Completed</MenuItem>
                    <MenuItem onClick={() => handleStatusChange(survey.id, "REJECTED")}>Rejected</MenuItem>
                  </Menu>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="mt-2 px-4 py-2 text-white rounded flex-1 transition-all duration-200"
                      style={{
                        backgroundColor: filterInfo.bg,
                      }}
                    >
                      {filterInfo.name}
                    </button>
                    <Menu
                      menuButton={
                        <button className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded transition-all duration-200 hover:bg-gray-300">
                          Actions
                        </button>
                      }
                      transition
                    >
                      <MenuItem onClick={() => handleSurveyClick(survey.id)}>View</MenuItem>
                      <MenuItem onClick={() => handleDelete(survey.id, index)}>Delete</MenuItem>
                    </Menu>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 transition-all duration-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 transition-all duration-200 hover:bg-gray-300 disabled:hover:bg-gray-200"
          >
            Previous
          </button>
          <div className="flex gap-2 mx-4">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  currentPage === page + 1 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 transition-all duration-200 hover:bg-gray-300 disabled:hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default SurveyList;