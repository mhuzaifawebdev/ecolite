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

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
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
    let url = `${baseUrl}/api/jobs?page=${page}&limit=7`; // Add pagination parameters

    if (user.role === "ADMIN") {
      url += `&all=true`; 
      // Modify API endpoint to get all surveys if needed
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
        setTotalPages(result.numOfPages || 1); // Set total pages from API response
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
    fetchSurveys(currentPage); // Fetch surveys for the current page
  }, [token, currentPage]);

  const handleStatusChange = async (surveyId, newStatus) => {
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    if (user.role !== "ADMIN") {
      setError("You are not authorized to change the status.");
      return;
    }
    const authorizationToken = `${token}`;
    const url = `${baseUrl}/api/jobs/changeStatus`;
    const data = new FormData();
    data.append("id", surveyId);
    data.append("status", newStatus);
    try {
      await axios.post(url, data, {
        headers: {
          authorization: authorizationToken,
        },
      });
      fetchSurveys(currentPage); // Refresh surveys for the current page
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleSurveyClick = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const handleDelete = (index) => {
    const updatedSurveys = [...surveys];
    updatedSurveys.splice(index, 1);
    setSurveys(updatedSurveys);
    localStorage.setItem(
      `user_:userId_surveys`,
      JSON.stringify(updatedSurveys)
    );
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  // Filtered surveys based on selected status
  const filteredSurveys = filterSurveys(surveys, statusFilter, searchQuery);

  return (
    <>
      <div className="w-full p-5 overflow-auto">
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

        {/* Table View */}
        <div className="relative xl:flex hidden overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-[#ffff] py-3 uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Title
                </th>
                <th scope="col" className="px-6 py-5">
                  Location
                </th>
                <th scope="col" className="px-6 py-5">
                  Name
                </th>
                <th scope="col" className="px-6 py-5">
                  Phone
                </th>
                <th scope="col" className="px-6 py-5">
                  Availability
                </th>
                <th scope="col" className="px-6 py-5">
                  Description
                </th>
                <th scope="col" className="px-6 py-5">
                  Status
                </th>
                <th scope="col" className="px-6 py-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSurveys.map((survey, index) => (
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
                    {user.role === "ADMIN" ? (
                      <Menu
                        menuButton={
                          <p
                            className="rounded-md px-3 py-1 max-w-max"
                            style={{
                              backgroundColor: filters[survey.status].bg,
                              color: filters[survey.status].color,
                            }}
                          >
                            {filters[survey.status].name || "N/A"}
                          </p>
                        }
                        transition
                      >
                        <MenuItem onClick={() => handleStatusChange(survey.id, "new")}>New</MenuItem>
                        <MenuItem onClick={() => handleStatusChange(survey.id, "inProgress")}>In Progress</MenuItem>
                        <MenuItem onClick={() => handleStatusChange(survey.id, "pending")}>Pending</MenuItem>
                        <MenuItem onClick={() => handleStatusChange(survey.id, "accepted")}>Accepted</MenuItem>
                        <MenuItem onClick={() => handleStatusChange(survey.id, "rejected")}>Rejected</MenuItem>
                      </Menu>
                    ) : (
                      <p
                        className="rounded-md px-3 py-1 max-w-max"
                        style={{
                          backgroundColor: filters[survey.status].bg,
                          color: filters[survey.status].color,
                        }}
                      >
                        {filters[survey.status].name || "N/A"}
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
                          <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card View */}
        <div className="xl:hidden max-w-[1300px] w-full mx-auto container grid md:grid-cols-3 sm:grid-cols-2 gap-5">
          {filteredSurveys.map((survey, index) => (
            <div key={survey.id} className="flex flex-col min-h-full mx-auto justify-between items-stretch gap-3 p-3 bg-white max-w-[335px] w-full rounded-[6px]">
              <div className="w-full items-center flex justify-between">
                <p className="text-[#767676] leading-4 text-[12px]">
                  Posted {calculateTimeSinceCreation(survey.createdAt)}
                </p>
                <span>
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
                <div className="flex gap-2 items-center">
                  <div className="relative flex">
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
                            Details
                          </button>
                        }
                        transition
                      >
                        <MenuItem onClick={() => handleSurveyClick(survey.id)}>View</MenuItem>
                        <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
              {user.role === "user" && (
                <button
                  onClick={() => handleSurveyClick(survey.id)}
                  className={`mt-2 px-4 py-2 ${
                    survey.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                  } text-white rounded`}
                >
                  {filters[survey.status].name}
                </button>
              )}
              {user.role === "ADMIN" ? (
                <Menu
                  menuButton={
                    <button
                      className={`mt-2 px-4 cursor-pointer py-2 ${
                        survey.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                      } text-white rounded`}
                    >
                      {survey.status}
                    </button>
                  }
                  transition
                >
                  <MenuItem onClick={() => handleStatusChange(survey.id, "new")}>New</MenuItem>
                  <MenuItem onClick={() => handleStatusChange(survey.id, "inProgress")}>In Progress</MenuItem>
                  <MenuItem onClick={() => handleStatusChange(survey.id, "pending")}>Pending</MenuItem>
                  <MenuItem onClick={() => handleStatusChange(survey.id, "accepted")}>Accepted</MenuItem>
                  <MenuItem onClick={() => handleStatusChange(survey.id, "rejected")}>Rejected</MenuItem>
                </Menu>
              ) : (
                <Menu
                  menuButton={
                    <button
                      className={`mt-2 px-4 max-w-max bg-transparent text-center flex items-center justify-center cursor-pointer py-2 ${
                        survey.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                      } text-white rounded`}
                    >
                      Details
                    </button>
                  }
                  transition
                >
                  <MenuItem onClick={() => handleSurveyClick(survey.id)}>View</MenuItem>
                  <MenuItem onClick={() => handleDelete(index)}>Delete</MenuItem>
                </Menu>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex gap-2 mx-4">
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page + 1 ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {page + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default SurveyList;

// utils/filterSurveys.js
export const filterSurveys = (surveys, statusFilter, searchQuery) => {
  return surveys
    .filter(
      (survey) =>
        statusFilter === "all" || survey.status.toLowerCase() === statusFilter
    )
    .filter(
      (survey) =>
        survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

const filters = {
  ALL: {
    color: "white",
    bg: "white",
    name: "All",
    id: "all",
  },
  NEW: {
    color: "#40B554",
    bg: "#357832",
    name: "New",
    id: "new",
  },
  INPROGRESS: {
    color: "#CDBA0B",
    bg: "#FFFCE2",
    name: "In Progress",
    id: "inProgress",
  },
  PENDING: {
    color: "#1BB4BE",
    bg: "#E4F2F4",
    name: "Pending",
    id: "pending",
  },
  ACCEPTED: {
    color: "#0f0",
    bg: "#00ff003f",
    name: "Accepted",
    id: "accepted",
  },
  REJECTED: {
    color: "#FF1F00",
    bg: "#F4E5E4",
    name: "Rejected",
    id: "rejected",
  },
};