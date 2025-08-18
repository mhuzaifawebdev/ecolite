import React, { useEffect, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { baseUrl } from '../Config/Urls';
import Spinner from './Spinner';
import { MdOutlineAddBox } from 'react-icons/md';
import { IoCloseOutline } from 'react-icons/io5';
import {colors} from "../Config/Colors.js";

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  location: Yup.string().required('Location is required'),
  name: Yup.string().required('Name is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number is not valid')
    .min(10, 'Phone number should be at least 10 digits'),
  availabilityDate: Yup.date().required('Availability date is required'),
  availabilityTime: Yup.string().required('Availability time is required'),
  description: Yup.string().required('Description is required'),
});

function AddSurvey() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      setToken(user.accessToken);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      location: '',
      name: '',
      phoneNumber: '',
      availabilityDate: '',
      availabilityTime: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      // Debugging: log the token
      console.log("Token:", token);

      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("authorization", `${token}`);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          title: values.title,
          location: values.location,
          name: values.name,
          phone: values.phoneNumber,
          date: values.availabilityDate,
          description: values.description,
          time: { from: "09:00", to: values.availabilityTime },
        }),
      };

      try {
        const response = await fetch(`${baseUrl}/api/jobs/create`, requestOptions);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }
        const result = await response.json();
        console.log('Survey submitted:', result);
        // Navigate with state containing the new survey data
        navigate(`/surveys`, { 
          state: { 
            newSurvey: result.data,
            action: 'create'
          } 
        });
      } catch (error) {
        console.error('Error submitting survey:', error);
        setError(error.message || 'Failed to submit survey. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBack = () => {
    navigate(`/surveys`);
  };


  return (
    <div className="flex items-center h-screen py-5 justify-center bg-[#000000]/30">
      <div className="flex w-full items-center  justify-center mx-auto px-5 container">
        <div className="bg-[#ffff] p-4 rounded-[22px] shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div onClick={handleBack} className='flex relative cursor-pointer items-center w-full justify-center '>
          <div className='flex w-full justify-end absolute -top-2  '>
          <IoCloseOutline className='w-6 h-6' />
            </div>  
            <h2 className="text-xl text-center font-semibold">Add New Survey</h2>
          </div>
          <form onSubmit={formik.handleSubmit} className=" flex flex-col gap-3">
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div className=' relative '>
            <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter survey title"
                className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''}`}
              />
              {formik.touched.title && formik.errors.title && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.title}</div>}
            </div>
            <div className='relative'>
              <label className="block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   ">Location</label>
              <input
                type="text"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter location"
                className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.location && formik.errors.location ? 'border-red-500' : ''}`}
              />
              {formik.touched.location && formik.errors.location && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.location}</div>}
            </div>
            <div className='relative'>
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white   `}>Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your name"
                className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
              />
              {formik.touched.name && formik.errors.name && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.name}</div>}
            </div>
            <div className='relative'>
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter phone number"
                className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : ''}`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.phoneNumber}</div>}
            </div>
            <div className='relative'>
              {/* <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Date of Availability</label> */}
              <div className="flex flex-col gap-6">
                <div className='relative'>
                <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Date of Availability</label>
                  <input
                    type="date"
                    name="availabilityDate"
                    value={formik.values.availabilityDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select date"
                    className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.availabilityDate && formik.errors.availabilityDate ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.availabilityDate && formik.errors.availabilityDate && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.availabilityDate}</div>}
                </div>
                <div className='relative w-full'>
                        <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Time of Availability</label>
                  <input
                    type="time"
                    name="availabilityTime"
                    value={formik.values.availabilityTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select time"
                    className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.availabilityTime && formik.errors.availabilityTime ? 'border-red-500' : ''}`}
                  />
                  {formik.touched.availabilityTime && formik.errors.availabilityTime && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.availabilityTime}</div>}
                </div>
              </div>
            </div>
            <div className='relative w-full'>
              <label className={`block  max-w-max text-[16px] leading-5 relative ml-3 font-medium text-primary bg-white`}>Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter description"
                className={`w-full px-3  border  -mt-[9px] text- rounded-[12px] ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
              />
              {formik.touched.description && formik.errors.description && <div className="text-red-500 absolute ml-3 z-10 -bottom-4 text-[11px]">{formik.errors.description}</div>}
            </div>
          
            <button
                type="submit"
                className="w-full bg-buttonsBg rounded-full my-2 py-2 flex items-center gap-2 justify-center font-medium  text-[18px] leading-6 text-white p-1 duration-300  "
              >
                {loading ? <Spinner/> :(<>
                 

                <span className="text-[18px]  leading-6">
                Submit
                </span>
                </>) }
              
              </button>
           
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSurvey;

