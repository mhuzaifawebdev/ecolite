// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { MdArrowBackIos } from 'react-icons/md';
// import { ImCancelCircle } from 'react-icons/im';
// import { HiOutlineDotsVertical } from 'react-icons/hi';
// import { FiCheckCircle } from 'react-icons/fi';
// import { CiNoWaitingSign } from 'react-icons/ci';

// function Notifications() {
//     const navigate = useNavigate();


//   const { userId } = useParams();
//   const [userSurveys, setUserSurveys] = useState([]);

//   useEffect(() => {
//     // Fetch user's surveys from localStorage on component mount
//     const storedSurveys = JSON.parse(localStorage.getItem(`user_${userId}_surveys`)) || [];
//     setUserSurveys(storedSurveys);
//   }, [userId]);

//   const calculateTimeSinceCreation = (createdTime) => {
//     const now = new Date();
//     const createdDate = new Date(createdTime);
//     const differenceInMillis = now - createdDate;
//     const differenceInHours = differenceInMillis / 3600000;
//     const differenceInDays = differenceInMillis / (1000 * 3600 * 24);

//     if (differenceInDays >= 1) {
//       return `${Math.floor(differenceInDays)} days ago`;
//     } else if (differenceInHours >= 1) {
//       return `${Math.floor(differenceInHours)} hours ago`;
//     } else {
//       return `${Math.floor(differenceInMillis / 60000)} minutes ago`;
//     }
//   };

//   return (
//     <div className=" bg-[#f7f8f8] container mx-auto flex-col gap-5 w-full h-screen ">
//     <div className='min-h-[65px] flex items-center justify-between px-5  rounded-b-[10px] bg-[#ffffff]'>
//      <div className='flex items-center'>
//        <span  onClick={() => navigate('/user-dashboard')}><MdArrowBackIos className='w-5 h-5 cursor-pointer' /></span>
//         <span className='text-[20px] leading-6 font-medium'>Notifications</span></div>
//     </div>
     
//       {userSurveys.map(survey => (
//         <div key={survey.id} className="p-4  flex justify-between items-center">
//           <div className='flex items-center mt-1 w-full justify-between '>
//           <div className='flex items-center gap-3'>
//           <div className="flex  w-[27px] h-[27px] items-center">
//             {survey.status === 'completed' && <FiCheckCircle className="text-green-500 w-8 h-8" />}
//             {survey.status === 'rejected' && <ImCancelCircle className="text-red-500 w-8 h-8" />}
//             {survey.status === 'pending' && <CiNoWaitingSign className="text-blue-500 w-5 h-5" />}
//           </div>
//               <div className=' flex flex-col  items-start '>
//             <p className='text-[16px] leading-5 font-medium'>Survey {survey.status}</p>

//             <h2 className="text-xs leading-4 text-[#3C3C3C80] "> {survey.title} {survey.status}</h2>
//             <p className="text-xs leading-4 text-[#3C3C3C80] ">{calculateTimeSinceCreation(survey.id)}</p>
//               </div>
//           </div>
        
//               <div>
//               <HiOutlineDotsVertical className='w-5 font-medium h-5' />
//               </div>
//           </div>
          
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Notifications;







import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MdArrowBackIos } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FiCheckCircle } from 'react-icons/fi';
import { CiNoWaitingSign } from 'react-icons/ci';
import axios from 'axios';
import  {baseUrl} from '../Config/Urls'
function Notifications() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userSurveys, setUserSurveys] = useState([]);

  // useEffect(() => {
  //   // Fetch user data from localStorage
  //   const storedUser = JSON.parse(localStorage.getItem('user'));
  //   if (storedUser && storedUser._id === userId) {
  //     setUser(storedUser);

  //     // Fetch user's surveys from localStorage based on user ID
  //     const storedSurveys = JSON.parse(localStorage.getItem(`user_${userId}_surveys`)) || [];
  //     setUserSurveys(storedSurveys);
  //   }
  // }, [userId]);

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
   

  return (
    <div className="bg-[#f7f8f8]  flex-col gap-5 w-full ">
      <div className='min-h-[65px] flex items-center justify-between px-5 rounded-b-[10px] bg-[#ffffff]'>
        <div className='flex items-center'>
          <span onClick={() => navigate('/user-dashboard')}>
            <MdArrowBackIos className='w-5 h-5 cursor-pointer' />
          </span>
          <span className='text-[20px] leading-6 font-medium'>Notifications</span>
        </div>
      </div>

      {userSurveys.length === 0 ? (
        <p className="text-center mt-4">No notifications available.</p>
      ) : (
        userSurveys.map(survey => (
          <div key={survey.id} className="p-4 flex justify-between items-center bg-white rounded-lg shadow-sm mb-2">
            <div className='flex items-center mt-1 w-full justify-between'>
              <div className='flex items-center gap-3'>
                <div className="flex w-[27px] h-[27px] items-center">
                  {survey.status === 'completed' && <FiCheckCircle className="text-green-500 w-8 h-8" />}
                  {survey.status === 'rejected' && <ImCancelCircle className="text-red-500 w-8 h-8" />}
                  {survey.status === 'pending' && <CiNoWaitingSign className="text-blue-500 w-5 h-5" />}
                </div>
                <div className='flex flex-col items-start'>
                  <p className='text-[16px] leading-5 font-medium'>Survey {survey.status}</p>
                  <h2 className="text-xs leading-4 text-[#3C3C3C80]">{survey.title} {survey.status}</h2>
                  <p className="text-xs leading-4 text-[#3C3C3C80]">{calculateTimeSinceCreation(survey.createdAt)}</p>
                </div>
              </div>

              <div>
                <HiOutlineDotsVertical className='w-5 font-medium h-5' />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
