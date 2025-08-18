/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Sidebar from "./SideBar";
import useWindowResize from '../../hooks/useWindowResize'
import { TbMenu2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../Config/Urls'; // Ensure this path is correct
import Spinner from "../Spinner";
import { IoCloseOutline } from "react-icons/io5";
import {colors} from "../../Config/Colors.js";





const Layout = ({ children }) => {
  // Initialize state as boolean value
  const [isSidebarCompress, setIsSidebarCompress] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowResize();
  window?.innerWidth >= 1280 &&
    isSidebarCompress === null &&
    setIsSidebarCompress(true);

  const toggleSidebar = () => {
    setIsSidebarCompress(!isSidebarCompress);
  };
  useEffect(() => {
    // window.addEventListener("resize",()=>setIsSidebarCompress(window.innerWidth>768))
    if (width <= 1280) {
      setIsSidebarCompress(false);
    } else {
      setIsSidebarCompress(true);
    }
  }, [width]);
  // Function to toggle sidebar
  const[user, setUser] = useState(null);
  const processing = false ;

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
      const response = await fetch(`${baseUrl}/api/user/update`, requestOptions);
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
    <>
      <div className="flex  bg-[#f5f5f5] relative w-full">
        <div className="    max-w-[320px]">
          <Sidebar
            toggleSidebar={setIsSidebarCompress}
            isSidebarCompress={isSidebarCompress}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
        </div>
        <div
          onClick={toggleSidebar}
          className={`bg-black/50 ${
            !isSidebarCompress ? "hidden" : "md:hidden z-[45] block fixed left-0 top-0 h-full w-full"
          }`}
        ></div>
        <div className="w-[calc(100%-80px)] p-2 flex flex-col flex-1  min-h-screen h-max ">
           <div className="w-full flex sm:hidden items-center justify-end">
           <button className="max-w-max " onClick={toggleSidebar}><TbMenu2 className='w-7 h-7 mt-2 ' /></button>
            </div>   
          <div className="min-h-[calc(100vh-90px)]   rounded-t-[28px] rounded-b-[28px] ">{children}</div>
        </div>
        {
        isOpen && (
          <div  className="absolute z-[99] top-0 left-0 w-full flex items-center justify-center inset-0 min-h-screen bg-black/50">
          <div className="bg-white px-5 z-[999] relative overflow-auto rounded-[22px] flex-col w-full max-w-xl ">
      <div className=' mt-2 flex items-center justify-between  rounded-b-[10px]'>
        <div className='flex w-full justify-end'>
          <span onClick={() =>setIsOpen(false)}>  <IoCloseOutline className='w-7 h-7 cursor-pointer' /></span>
    
        </div>
        {/* <div onClick={handleUpdate} className='bg-[#008177] py-1 px-3 text-white rounded-[6px] cursor-pointer'>Save</div> */}
      </div>
      <div className=' '>
        {user ? (
          <div>
            <div className="flex flex-col items-center">
              <img
                src={profileImage || '/image/Avatar.png'}
                alt="Profile"
                className="w-[65px] min-h-[65px] rounded-full mb-3 cursor-pointer"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-blue-500 text-xs "
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
            <form onSubmit={handleUpdate} className="flex gap-2 flex-col ">
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col '>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3  border  -mt-[9px] text- rounded-[12px]"
                  required
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col gap-2'>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3  border  -mt-[17px] text- rounded-[12px]"
                  required
                  disabled
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col gap-2'>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Role</label>
                <input
                  type="tel"
                  
                  // onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3  border  -mt-[17px] text- rounded-[12px]"
                  required
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col gap-2'>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                     placeholder="Phone"
                
                  className="w-full px-3  border  -mt-[17px] text- rounded-[12px]"
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col gap-2'>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Time of Availability</label>
                <input
                  type="datetime-local"
                  value={availFrom}
                  onChange={(e) => setAvailFrom(e.target.value)}
                 
                  className="w-full px-3  border  -mt-[17px] text- rounded-[12px]"
                />
              </div>
              <div className='flex border-b-[1px] border-[#E9E9E9]  flex-col gap-2'>
                 <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Time of Unavailability</label>
                <input
                  type="datetime-local"
                  value={availTo}
                  onChange={(e) => setAvailTo(e.target.value)}
                  className="w-full px-3  border  -mt-[17px] text- rounded-[12px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-buttonsBg rounded-full my-5 py-2 flex items-center gap-2 justify-center font-medium  text-[18px] leading-6 text-white p-1 duration-300  "
              >
                {processing ? <Spinner/> :(<>
                  
                <span className="text-[18px]  leading-6">
                  Save
                </span>
                </>) }
              
              </button>
          
           
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
          </div>
        )
       }
      </div>
       
      
      

    </>
  );
};

export default Layout;
