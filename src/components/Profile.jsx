// import React, { useEffect, useRef, useState } from 'react';
// import { MdArrowBackIos } from 'react-icons/md';
// import { useNavigate } from 'react-router-dom';

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     console.log(user); 
//     if (user) {
//       setUser(user);
//       const savedProfileImage = localStorage.getItem(`profileImage-${user._id}`);
//       if (savedProfileImage) {
//         setProfileImage(savedProfileImage);
//       }
//     }
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setProfileImage(reader.result);
//       if (user) {
//         localStorage.setItem(`profileImage-${user._id}`, reader.result);
//       }
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="bg-[#f7f8f8] container mx-auto flex-col gap-5 w-full h-screen">
//       <div className='min-h-[65px] flex items-center justify-between px-5 rounded-b-[10px] bg-[#ffffff]'>
//         <div className='flex items-center'>
//           <span onClick={() => navigate(-1)}><MdArrowBackIos className='w-5 h-5 cursor-pointer' /></span>
//           <span className='text-[20px] leading-6 font-medium'>Profile</span>
//         </div>
//         <div onClick={() => alert('Save user data')} className='bg-[#008177] py-1 px-3 text-white rounded-[6px] cursor-pointer'>Save</div>
//       </div>
//       <div className='pt-8 pl-5'>
//         {user ? (
//           <div>
//             <div className="flex flex-col items-center">
//               <img
//                 src={profileImage || '/image/Avatar.png'}
//                 alt="Profile"
//                 className="w-[96px] min-h-[96px] rounded-full mb-4 cursor-pointer"
//               />
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="text-blue-500 mt-2"
//               >
//                 Edit Profile Picture
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleImageUpload}
//               />
//             </div>
//             <div className="flex flex-col translate-y-6">
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Name</label>
//                 <p className="text-[15px] leading-5 font-medium">{user.name}</p>
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Email</label>
//                 <p className="text-[15px] leading-5 font-medium">{user.email}</p>
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Role</label>
//                 <p className="text-[15px] leading-5 font-medium">{user.role}</p>
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//   <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Phone</label>
//   <p className="text-[15px] leading-5 font-medium">{user.phone || 'No phone number provided'}</p>
// </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Time of Availability</label>
//                 <p className="text-[15px] leading-5 font-medium">{user.timeOfAvailability.from} - {user.timeOfAvailability.to}</p>
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Time of Unavailability</label>
//                 <p className="text-[15px] leading-5 font-medium">{user.timeOfUnavailability.from} - {user.timeOfUnavailability.to}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-red-500 duration-300">No user data found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// import React, { useState } from 'react';
// import { baseUrl } from '../Config/Urls';

// const UpdateUserForm = () => {
//   const [name, setName] = useState('');
//   const [availFrom, setAvailFrom] = useState('');
//   const [availTo, setAvailTo] = useState('');
//   const [notAvailFrom, setNotAvailFrom] = useState('');
//   const [notAvailTo, setNotAvailTo] = useState('');
//   const [phone, setPhone] = useState('');
//   const [profileImage, setProfileImage] = useState(null);
  
//   const handleImageChange = (e) => {
//     setProfileImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("availFrom", availFrom);
//     formData.append("availTo", availTo);
//     formData.append("notAvailFrom", notAvailFrom);
//     formData.append("notAvailTo", notAvailTo);
//     formData.append("phone", phone);
//     if (profileImage) {
//       formData.append("profileImage", profileImage, profileImage.name);
//     }

//     const myHeaders = new Headers();
//     myHeaders.append("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmE2YTkzMTAxMmFiMjVhMjc2Y2JiZDgiLCJpYXQiOjE3MjI1MzA2NzZ9.rDhxYSw2As5HEJpJTGnrLjie5mH0gGBPs0llhPwyexg"
// );

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: formData,
//       redirect: "follow"
//     };

//     try {
//       const response = await fetch(`${baseUrl}/api/user/update`, requestOptions);
//       const result = await response.text();
//       console.log(result);
//       alert('User updated successfully');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error updating user');
//     }
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Update User</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="availFrom" className="block text-sm font-medium text-gray-700">Availability From</label>
//           <input
//             type="time"
//             id="availFrom"
//             value={availFrom}
//             onChange={(e) => setAvailFrom(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="availTo" className="block text-sm font-medium text-gray-700">Availability To</label>
//           <input
//             type="time"
//             id="availTo"
//             value={availTo}
//             onChange={(e) => setAvailTo(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="notAvailFrom" className="block text-sm font-medium text-gray-700">Not Available From</label>
//           <input
//             type="time"
//             id="notAvailFrom"
//             value={notAvailFrom}
//             onChange={(e) => setNotAvailFrom(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="notAvailTo" className="block text-sm font-medium text-gray-700">Not Available To</label>
//           <input
//             type="time"
//             id="notAvailTo"
//             value={notAvailTo}
//             onChange={(e) => setNotAvailTo(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
//           <input
//             type="tel"
//             id="phone"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
//           <input
//             type="file"
//             id="profileImage"
//             onChange={handleImageChange}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
//         >
//           Update
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateUserForm;
// import React, { useEffect, useRef, useState } from 'react';
// import { MdArrowBackIos } from 'react-icons/md';
// import { useNavigate } from 'react-router-dom';
// import { baseUrl } from '../Config/Urls'; // Ensure this path is correct

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [profileImage, setProfileImage] = useState('/image/Avatar.png'); // Default image
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [availFrom, setAvailFrom] = useState('');
//   const [availTo, setAvailTo] = useState('');
//   const [notAvailFrom, setNotAvailFrom] = useState('');
//   const [notAvailTo, setNotAvailTo] = useState('');
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setUser(storedUser);
//       setName(storedUser.name);
//       setEmail(storedUser.email);
//       setPhone(storedUser.phone || '');
//       setAvailFrom(storedUser.timeOfAvailability?.from || '');
//       setAvailTo(storedUser.timeOfAvailability?.to || '');
//       setNotAvailFrom(storedUser.timeOfUnavailability?.from || '');
//       setNotAvailTo(storedUser.timeOfUnavailability?.to || '');
//       const savedProfileImage = localStorage.getItem(`profileImage-${storedUser._id}`);
//       if (savedProfileImage) {
//         setProfileImage(savedProfileImage);
//       }
//     }
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setProfileImage(reader.result);
//       if (user) {
//         localStorage.setItem(`profileImage-${user._id}`, reader.result);
//       }
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//       setProfileImageFile(file);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("availFrom", availFrom);
//     formData.append("availTo", availTo);
//     formData.append("notAvailFrom", notAvailFrom);
//     formData.append("notAvailTo", notAvailTo);
//     if (profileImageFile) {
//       formData.append("profileImage", profileImageFile, profileImageFile.name);
//     }

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "authorization": `${user.accessToken}`, // Proper Bearer token format
//       },
//       body: formData,
//       redirect: "follow"
//     };

//     try {
//       const response = await fetch(`${baseUrl}/api/user/update`, requestOptions);
//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }
//       const result = await response.json(); // Parse JSON response
//       console.log(result);
//       alert('User updated successfully');
      
//       // Update local storage
//       const updatedUser = {
//         ...user,
//         name,
//         email,
//         phone,
//         timeOfAvailability: { from: availFrom, to: availTo },
//         timeOfUnavailability: { from: notAvailFrom, to: notAvailTo }
//       };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);
//     } catch (error) {
//       console.error('Error:', error);
//       alert(`Error updating user: ${error.message}`);
//     }
//   };

//   return (
//     <div className="bg-[#f7f8f8] container mx-auto flex-col gap-5 w-full h-screen">
//       <div className='min-h-[65px] flex items-center justify-between px-5 rounded-b-[10px] bg-[#ffffff]'>
//         <div className='flex items-center'>
//           <span onClick={() => navigate(-1)}><MdArrowBackIos className='w-5 h-5 cursor-pointer' /></span>
//           <span className='text-[20px] leading-6 font-medium'>Profile</span>
//         </div>
//         <div onClick={handleUpdate} className='bg-[#008177] py-1 px-3 text-white rounded-[6px] cursor-pointer'>Save</div>
//       </div>
//       <div className='pt-8 pl-5'>
//         {user ? (
//           <div>
//             <div className="flex flex-col items-center">
//               <img
//                 src={profileImage || '/image/Avatar.png'}
//                 alt="Profile"
//                 className="w-[96px] min-h-[96px] rounded-full mb-4 cursor-pointer"
//               />
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="text-blue-500 mt-2"
//               >
//                 Edit Profile Picture
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//                 onChange={handleImageUpload}
//               />
//             </div>
//             <form onSubmit={handleUpdate} className="flex flex-col translate-y-6">
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Email</label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                   disabled
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Phone</label>
//                 <input
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Availability From</label>
//                 <input
//                   type="datetime-local"
//                   value={availFrom}
//                   onChange={(e) => setAvailFrom(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Availability To</label>
//                 <input
//                   type="datetime-local"
//                   value={availTo}
//                   onChange={(e) => setAvailTo(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Not Available From</label>
//                 <input
//                   type="datetime-local"
//                   value={notAvailFrom}
//                   onChange={(e) => setNotAvailFrom(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                 />
//               </div>
//               <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
//                 <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Not Available To</label>
//                 <input
//                   type="datetime-local"
//                   value={notAvailTo}
//                   onChange={(e) => setNotAvailTo(e.target.value)}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                 />
//               </div>
//             </form>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useRef, useState } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Config/Urls';
import axios from "axios"; // Ensure this path is correct

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('/image/Avatar.png'); // Default image
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [availFrom, setAvailFrom] = useState('');
  const [availTo, setAvailTo] = useState('');
  const [notAvailFrom, setNotAvailFrom] = useState('');
  const [notAvailTo, setNotAvailTo] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name);
      setEmail(storedUser.email);
      setPhone(storedUser.phone || '');
      setAvailFrom(storedUser.timeOfAvailability?.from || '');
      setAvailTo(storedUser.timeOfAvailability?.to || '');
      setNotAvailFrom(storedUser.timeOfUnavailability?.from || '');
      setNotAvailTo(storedUser.timeOfUnavailability?.to || '');
      const savedProfileImage = localStorage.getItem(`profileImage-${storedUser._id}`);
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }

    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      if (user) {
        localStorage.setItem(`profileImage-${user._id}`, reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
      setProfileImageFile(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("timeOfAvailability[from]", availFrom);
    formData.append("timeOfAvailability[to]", availTo);
    formData.append("timeOfUnavailability[from]", notAvailFrom);
    formData.append("timeOfUnavailability[to]", notAvailTo);
    if (profileImageFile) {
      formData.append("profileImage", profileImageFile, profileImageFile.name);
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "authorization": `${user.accessToken}`, // Proper Bearer token format
      },
      body: formData,
      redirect: "follow"
    };

    try {
      const response = await axios.put(`${baseUrl}/api/user/${user._id}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const result = await response.json(); // Parse JSON response
      console.log(result);
      alert('User updated successfully');
      
      // Update local storage
      const updatedUser = {
        ...user,
        name,
        email,
        phone,
        timeOfAvailability: { from: availFrom, to: availTo },
        timeOfUnavailability: { from: notAvailFrom, to: notAvailTo },
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="bg-[#f7f8f8] overflow-auto  flex-col gap-5 w-full max-w- ">
      <div className='min-h-[65px] flex items-center justify-between px-5 rounded-b-[10px] bg-[#ffffff]'>
        <div className='flex items-center'>
          <span onClick={() => navigate(-1)}><MdArrowBackIos className='w-5 h-5 cursor-pointer' /></span>
          <span className='text-[20px] leading-6 font-medium'>Profile</span>
        </div>
        <div onClick={handleUpdate} className='bg-[#008177] py-1 px-3 text-white rounded-[6px] cursor-pointer'>Save</div>
      </div>
      <div className='pt-8 pl-5'>
        {user ? (
          <div>
            <div className="flex flex-col items-center">
              <img
                src={profileImage || '/image/Avatar.png'}
                alt="Profile"
                className="w-[96px] min-h-[96px] rounded-full mb-4 cursor-pointer"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-blue-500 mt-2"
              >
                Edit Profile Picture
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col ">
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                  disabled
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Availability From</label>
                <input
                  type="datetime-local"
                  value={availFrom}
                  onChange={(e) => setAvailFrom(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Availability To</label>
                <input
                  type="datetime-local"
                  value={availTo}
                  onChange={(e) => setAvailTo(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Not Available From</label>
                <input
                  type="datetime-local"
                  value={notAvailFrom}
                  onChange={(e) => setNotAvailFrom(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9] pb-3 pt-2 flex-col gap-2'>
                <label className='text-[#989898] text-[14px] leading-4 font-medium text-start'>Not Available To</label>
                <input
                  type="datetime-local"
                  value={notAvailTo}
                  onChange={(e) => setNotAvailTo(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
          
           
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;







