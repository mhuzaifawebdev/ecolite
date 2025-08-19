/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../Config/Urls';
import axios from 'axios';
import { 
  IoPeopleSharp, 
  IoPersonAddSharp, 
  IoCalendarSharp,
  IoCheckmarkDoneSharp,
  IoRefreshSharp
} from 'react-icons/io5';

const DashboardCards = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCardData = async () => {
    // Check if we have cached data and it's less than 5 minutes old
    const cachedData = localStorage.getItem('dashboardCardsData');
    const cachedTimestamp = localStorage.getItem('dashboardCardsTimestamp');
    
    if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < 300000)) {
      setCardData(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/preChecks/fetch/getCards`);
      
      if (response.data?.status && response.data?.data) {
        const transformedData = [
          { 
            title: 'Total Leads', 
            value: response.data.data.totalLeads, 
            change: 'All time leads',
            icon: <IoPeopleSharp className="text-3xl" />
          },
          { 
            title: 'New Leads', 
            value: response.data.data.newLeads, 
            change: 'Today\'s new leads',
            icon: <IoPersonAddSharp className="text-3xl" />
          },
          { 
            title: 'Booked Installations', 
            value: response.data.data.bookedInstall, 
            change: 'Scheduled installations',
            icon: <IoCalendarSharp className="text-3xl" />
          },
          { 
            title: 'Completed Installations', 
            value: response.data.data.completedInstall, 
            change: 'Finished installations',
            icon: <IoCheckmarkDoneSharp className="text-3xl" />
          }
        ];
        setCardData(transformedData);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      setError(err.message);
      // Fallback data
      // setCardData([
      //   { 
      //     title: 'Total Leads', 
      //     value: 57, 
      //     change: 'All time leads',
      //     icon: <IoPeopleSharp className="text-3xl" />
      //   },
      //   { 
      //     title: 'New Leads', 
      //     value: 0, 
      //     change: 'Today\'s new leads',
      //     icon: <IoPersonAddSharp className="text-3xl" />
      //   },
      //   { 
      //     title: 'Booked Installations', 
      //     value: 5, 
      //     change: 'Scheduled installations',
      //     icon: <IoCalendarSharp className="text-3xl" />
      //   },
      //   { 
      //     title: 'Completed Installations', 
      //     value: 1, 
      //     change: 'Finished installations',
      //     icon: <IoCheckmarkDoneSharp className="text-3xl" />
      //   },
      // ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-full h-40 animate-pulse"
            >
              <div className="absolute inset-0 bg-white opacity-10 blur-lg rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchCardData}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh data"
          >
            <IoRefreshSharp className="text-gray-600" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{error} - Showing fallback data</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full cursor-pointer">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative bg-primary p-6 rounded-lg shadow-lg w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white opacity-10 blur-lg rounded-lg"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white opacity-80">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                <p className="text-xs text-white opacity-80 mt-2">{card.change}</p>
              </div>
              
              <div className="p-3 rounded-full bg-white bg-opacity-20">
                {card.icon}
              </div>
            </div>
            
            {card.title === 'New Leads' && (
              <div className="mt-4">
                <div className="h-1 bg-white bg-opacity-30 rounded-full">
                  <div 
                    className="h-1 bg-white rounded-full" 
                    style={{ width: `${(card.value / 15) * 100}%` }} 
                  ></div>
                </div>
                <p className="text-xs text-white opacity-80 mt-1 text-right">
                  {card.value > 0 ? `${card.value} today` : 'No new leads yet'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;