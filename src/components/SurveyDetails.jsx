import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../Config/Urls";
import SurveyDetailsItems from "./SurveyDetailsItems";
import { IoArrowBackSharp } from "react-icons/io5";

function SurveyDetails() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSurveyDetail = async () => {
    setLoading(true);
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(`${baseUrl}/api/jobs?id=${surveyId}`, {
        headers: {
          authorization: `${userFromStorage.accessToken}`,
        },
      });
      setSurvey(response.data.data[0]);
      setError(null);
    } catch (error) {
      console.error("Error fetching survey details:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyDetail();
  }, [surveyId]);

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="h-screen overflow-hidden">
      {survey && (
        <div className="flex flex-col md:flex-row h-screen">
          {/* Sidebar */}
          <div className="flex flex-col bg-white w-full md:max-w-[360px] p-5 overflow-y-auto">
            <div className="mb-5">
              <button
                onClick={handleBack}
                className="px-2 py-2 rounded-full bg-[#DDDDDD]"
              >
                <IoArrowBackSharp className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center">
                <div className="w-[111px] h-[111px] flex items-center justify-center rounded-full bg-[#DDDDDD]">
                  {/* Placeholder for user avatar */}
                </div>
                <h1 className="text-[20px] font-medium mt-2">{survey.name}</h1>
                <p className="text-[12px] font-medium">{survey.title}</p>
              </div>
              <p className="flex items-center gap-2 text-[18px] font-medium">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.3913 6.99967C17.5308 7.222 18.5781 7.77931 19.3991 8.60027C20.22 9.42122 20.7773 10.4685 20.9996 11.608M16.3913 2.33301C18.7588 2.59602 20.9665 3.65621 22.6519 5.33952C24.3373 7.02282 25.4003 9.22919 25.6663 11.5963M11.9311 16.1733C10.5293 14.7714 9.42236 13.1863 8.61036 11.4951C8.54052 11.3496 8.5056 11.2769 8.47877 11.1849C8.38342 10.8578 8.45191 10.4561 8.65025 10.1791C8.70607 10.1012 8.77275 10.0345 8.90611 9.90115C9.31399 9.49328 9.51793 9.28934 9.65126 9.08427C10.1541 8.31089 10.1541 7.31388 9.65126 6.54051C9.51792 6.33544 9.31399 6.1315 8.90611 5.72363L8.67877 5.49628C8.05875 4.87626 7.74874 4.56625 7.4158 4.39785C6.75364 4.06294 5.97167 4.06294 5.30951 4.39785C4.97657 4.56625 4.66656 4.87626 4.04654 5.49628L3.86264 5.68019C3.24474 6.29808 2.9358 6.60703 2.69984 7.02706C2.43802 7.49315 2.24976 8.21706 2.25135 8.75165C2.25279 9.23342 2.34624 9.56268 2.53315 10.2212C3.53761 13.7602 5.43283 17.0996 8.21881 19.8856C11.0048 22.6715 14.3442 24.5668 17.8832 25.5712C18.5417 25.7581 18.871 25.8516 19.3527 25.853C19.8873 25.8546 20.6112 25.6664 21.0773 25.4045C21.4973 25.1686 21.8063 24.8596 22.4242 24.2417L22.6081 24.0578C23.2281 23.4378 23.5381 23.1278 23.7065 22.7949C24.0414 22.1327 24.0414 21.3507 23.7065 20.6886C23.5381 20.3556 23.2281 20.0456 22.6081 19.4256L22.3808 19.1983C21.9729 18.7904 21.7689 18.5864 21.5639 18.4531C20.7905 17.9503 19.7935 17.9503 19.0201 18.4531C18.815 18.5865 18.6111 18.7904 18.2032 19.1983C18.0699 19.3316 18.0032 19.3983 17.9252 19.4541C17.6482 19.6525 17.2466 19.721 16.9195 19.6256C16.8275 19.5988 16.7547 19.5639 16.6093 19.494C14.918 18.682 13.333 17.5751 11.9311 16.1733Z"
                    stroke="black"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {survey.phone}
              </p>
              <p className="flex items-center gap-2 text-[18px] font-medium">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 15.1663C15.933 15.1663 17.5 13.5993 17.5 11.6663C17.5 9.73334 15.933 8.16634 14 8.16634C12.067 8.16634 10.5 9.73334 10.5 11.6663C10.5 13.5993 12.067 15.1663 14 15.1663Z"
                    stroke="black"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 25.6663C18.6666 20.9997 23.3333 16.821 23.3333 11.6663C23.3333 6.51168 19.1546 2.33301 14 2.33301C8.8453 2.33301 4.66663 6.51168 4.66663 11.6663C4.66663 16.821 9.33329 20.9997 14 25.6663Z"
                    stroke="black"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {survey.location}
              </p>
              <p className="flex items-center gap-2 text-[18px] font-medium">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.5 11.6663H3.5M18.6667 2.33301V6.99967M9.33333 2.33301V6.99967M9.1 25.6663H18.9C20.8602 25.6663 21.8403 25.6663 22.589 25.2849C23.2475 24.9493 23.783 24.4139 24.1185 23.7553C24.5 23.0066 24.5 22.0265 24.5 20.0663V10.2663C24.5 8.30616 24.5 7.32607 24.1185 6.57737C23.783 5.91881 23.2475 5.38338 22.589 5.04782C21.8403 4.66634 20.8602 4.66634 18.9 4.66634H9.1C7.13982 4.66634 6.15972 4.66634 5.41103 5.04782C4.75247 5.38338 4.21703 5.91881 3.88148 6.57737C3.5 7.32607 3.5 8.30616 3.5 10.2663V20.0663C3.5 22.0265 3.5 23.0066 3.88148 23.7553C4.21703 24.4139 4.75247 24.9493 5.41103 25.2849C6.15972 25.6663 7.13982 25.6663 9.1 25.6663Z"
                    stroke="black"
                    strokeWidth="2.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {new Date(survey.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <SurveyDetailsItems data={survey.survey} />
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyDetails;