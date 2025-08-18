import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Config/Urls';
import { AiOutlineUser } from 'react-icons/ai';
import { CiHeart, CiLocationOn } from 'react-icons/ci';
import { LuPhone } from 'react-icons/lu';
import { MdArrowBackIosNew, MdArrowForwardIos, MdMoreVert, MdOutlineDateRange } from 'react-icons/md';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { IoIosSearch, IoMdAdd } from 'react-icons/io';


const filterSurveys = (surveys, statusFilter, searchQuery) => {
  return surveys.filter(survey => {
    const matchesStatus = statusFilter === 'all' || survey.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesQuery = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });
};
function SingleUserSurvey() {
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
 
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromStorage) {
      setUser(userFromStorage);
      setToken(userFromStorage.accessToken);
    }
  }, []);

  const fetchSurveys = async (page) => {
    if (!token || !user) {
      setError('User is not authenticated.');
      return;
    }

    setLoading(true);
    const authorizationToken = `${token}`;
    const url = `${baseUrl}/api/jobs?page=${page}&limit=7&userId=${user._id}`;


    try {
      const response = await axios.get(url, {
        headers: {
          'authorization': authorizationToken,
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
    fetchSurveys(currentPage);
  }, [token, user,currentPage]);

  const handleSurveyClick = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const handleDelete = (index) => {
    const updatedSurveys = [...surveys];
    updatedSurveys.splice(index, 1);
    setSurveys(updatedSurveys);
    localStorage.setItem(`user_${user._id}_surveys`, JSON.stringify(updatedSurveys));
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
      case 'Pending':
        return 'bg-blue-500'; // Yellow for pending
      case 'Completed':
        return 'bg-green-500'; // Green for completed
      case 'Rejected':
        return 'bg-red-500'; // Red for rejected
      default:
        return 'bg-green-500'; // Gray for unknown status
    }
  };



  const filteredSurveys = filterSurveys(surveys, statusFilter, searchQuery);
    console.log("first333333",filteredSurveys)
  return (
    <div className=" w-full ">
   <div className="  flex-col flex gap-5 w-full ">
   <div className="flex flex-col flex-1 justify-between bg-[#f5f5f5]  sm:flex-row items-center gap-5 ">
                      <div className="relative w-full sm:w-[65%] md:w-[75%]">
                        <input
                          id="searchQuery"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className=" w-full px-10 py-2 border rounded-full bg-white text-gray-700"
                          placeholder="Search"
                        />
                        <IoIosSearch className="w-6 h-6 absolute top-2 left-2 text-gray-500" />
                      </div>
                      <div
                        onClick={() => navigate("/add-survey/:userId")}
                        className=" cursor-pointer bg-[#ff1a30] md:py-3 py-2 lg:py-2 w-full sm:w-[35%] flex items-center justify-center gap-2 px-2 border rounded-full"
                      >
                        <IoMdAdd className="lg:w-5 w-4 h-4 lg:h-5 text-white" />
                        <p className="font-medium sm:text-[12px] md:text-sm lg:text-lg text-white">Add New Survey</p>
                      </div>
                    </div> 
 
              <div className="flex lg:items-center mb-5  min-h-[44px] md:rounded-full  flex-wrap p-1 bg-[#EAF0FF] max-w-max ">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`${statusFilter === "all"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-8 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("new")}
                  className={`${statusFilter === "new"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  New
                </button>
                <button
                  onClick={() => setStatusFilter("inprogress")}
                  className={`${statusFilter === "inprogress"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  Inprogress
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`${statusFilter === "pending"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("accepted")}
                  className={`${statusFilter === "accepted"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  Accepted
                  </button>
                  <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`${statusFilter === "rejected"
                    ? "bg-primary text-white"
                  : "text-primary"
                    } rounded-full px-4 py-[10px] text-[16px] leading-5 font-medium`}
                >
                  Rejected
                </button>
                </div>
               
              </div>
   
   
        <>
          {/* Table View */}
        
          <div class="relative overflow-x-auto   shadow-md rounded-lg">
    <table class="w-full  text-sm text-left rtl:text-right ">
        <thead class="text-xs text-[#ffff] py-3 uppercase bg-primary ">
            <tr>
                <th scope="col" class="px-6 py-5">
                Title
                </th>
                <th scope="col" class="px-6 py-5">
                Location
                </th>
                <th scope="col" class="px-6 py-5">
                Name
                </th>
                <th scope="col" class="px-6 py-5">
                Phone
                </th>
                <th scope="col" class="px-6 py-5">
                Availability
                </th>
                <th scope="col" class="px-6 py-5">
                Description
                </th>
                <th scope="col" class="px-6 py-5">
                Status
                </th>
                <th scope="col" class="px-6 py-5">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
        {filteredSurveys.map((survey, index) => (
        
          <tr key={survey._id} className={`bg-${getStatusColor(survey.status)}`}  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {survey.title}
                </th>
                <td class="px-6 py-4">
                {survey.location}
                </td>
                <td class="px-6 py-4">
                {survey.name}
                </td>
                <td class="px-6 py-4">
                {survey.phone}
                </td>
                <td class="px-6 py-4">
                {survey?.date ? new Date(survey.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Ensures AM/PM format
  }) : 'No date available'}
                </td>
                <td class="px-6 py-4">
                {survey.description}
                </td>
                <td class="px-6 py-4">
                <p
                            className={`rounded-md px-3 py-1 max-w-max `}
                            style={{
                              backgroundColor: filters[survey.status].bg,
                              color: filters[survey.status].color,
                            }}
                          >
                            {filters[survey.status].name || "N/A"}
                          </p>
                </td>
                <td class="px-6 py-4">
                <div className="relative flex text-left">
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Menu menuButton={<button
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                margin: '0',
                              }}
                            >
                              <MdMoreVert size={30} color="#000" />
                            </button>} transition
                            >
                              <MenuItem
                                onClick={e => handleSurveyClick(survey._id)}
                              >View</MenuItem>
                              <MenuItem
                                onClick={e => handleDelete(index)}
                              >Delete</MenuItem>
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
          {/* <div className='xl:hidden max-w-[1300px] translate-y-6 w-full mx-auto container grid md:grid-cols-3 sm:grid-cols-2 gap-5'>
            {filteredSurveys.map((survey, index) => (
              <div key={survey._id} className={`flex flex-col min-h-full mx-auto justify-between items-stretch gap-3 p-3 bg-white shadow-md  max-w-[335px] w-full rounded-[6px]`}>
                <div className='w-full items-center flex justify-between'>
                  <p className=' leading-4 text-[12px]'>
                    Posted {calculateTimeSinceCreation(survey.createdAt)}
                  </p>
                </div>
                <p className='flex text-[20px] leading-6 font-semibold'>{survey.title}</p>
                <div className='flex flex-col gap-3'>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-[#6E4A58] p-2 rounded-lg'>
                      <CiLocationOn className='' />
                    </div>
                    <p className='text-sm'>{survey.location}</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-[#5B9B77] p-2 rounded-lg'>
                      <AiOutlineUser className='' />
                    </div>
                    <p className='text-sm'>{survey.name}</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-[#B58C5F] p-2 rounded-lg'>
                      <LuPhone className='' />
                    </div>
                    <p className='text-sm'>{survey.phone}</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <div className='bg-[#4A90E2] p-2 rounded-lg'>
                    <MdOutlineDateRange className='' />

                    </div>
                    <p className='text-sm'>
                    {survey?.date ? new Date(survey.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Ensures AM/PM format
  }) : 'No date available'}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between'>
                <div className={`relative items-center justify-center ${getStatusColor(survey.status)} rounded-md w-full flex text-left`}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Menu menuButton={<button
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                margin: '0',
                              }}
                            >
                            <button
                              className={`py-2 w-full px-4 text-xs ${getStatusColor(survey.status)}  rounded`}
                                       >
                                           {survey.status || 'N/A'}
                             </button>
                            </button>} transition
                            >
                              <MenuItem
                                onClick={e => handleSurveyClick(survey._id)}
                              >View</MenuItem>
                              <MenuItem
                                onClick={e => handleDelete(index)}
                              >Delete</MenuItem>
                            </Menu>
                          </div>
                        </div>
                 
                </div>
              </div>
            ))}
          </div> */}
          <div className=" flex justify-center items-center  mt-16">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="  text-gray-700 rounded-md"
            >
             <MdArrowBackIosNew className='w-5 h-5' />
            
            </button>
            <div className="flex gap-5">
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-2  text-[18px] rounded-md ${currentPage === page + 1 ? 'bg-black text-white' : ' text-gray-700'}`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="  text-gray-700 rounded-md"
            >
             <MdArrowForwardIos  className='w-5 h-5' />
             

            </button>

      
          </div>

        </>
    
    </div>
  );
}

export default SingleUserSurvey;

const filters = {
  all: {
    color: "white",
    bg: "white",
    name: "All",
    id: "all",
  },
  new: {
    color: "#40B554",
    bg: "#357832",
    name: "New",
    id: "new",
  },
  inProgress: {
    color: "#CDBA0B",
    bg: "#FFFCE2",
    name: "In Progress",
    id: "inProgress",
  },
  pending: {
    color: "#1BB4BE",
    bg: "#E4F2F4",
    name: "Pending",
    id: "pending",
  },
  accepted: {
    color: "#0f0",
    bg: "#00ff003f",
    name: "Accepted",
    id: "accepted",
  },
  rejected: {
    color: "#FF1F00",
    bg: "#F4E5E4",
    name: "Rejected",
    id: "rejected",
  },
};