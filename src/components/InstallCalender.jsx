import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchJobs } from '../Config/api.js';
import { ClipLoader } from 'react-spinners';

const localizer = momentLocalizer(moment);

const InstallColors = {
  'Install Booked': '#351F39', 
  'Install Pending': '#726A95', 
  'Install Incomplete': '#719FB0', 
  'Install Completed': '#A0C1B8', 
};

const InstallCalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupLeads, setPopupLeads] = useState([]);
  const [searchDate, setSearchDate] = useState({
    year: moment().year(),
    month: moment().month() + 1,
    day: moment().date(),
  });

  const [leadData, setLeadData] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await fetchJobs({
          all: true
        });
        const formattedData = response.jobs.map((lead) => ({
          id: lead.lead_id,
          title: lead.installStatus ? `${lead.installStatus} (${lead.lead_id})` : `Lead: ${lead.lead_id}`,
          start: new Date(lead.installDate),
          end: new Date(lead.installDate),
          installStatus: lead.installStatus,
          lead_id: lead.lead_id,
        }));
        setLeadData(formattedData);
      } catch (error) {
        console.error('Error fetching lead data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadData();
  }, []);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleSearchDateChange = (e) => {
    const { name, value } = e.target;
    setSearchDate({ ...searchDate, [name]: parseInt(value, 10) });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const { year, month, day } = searchDate;
    const newDate = new Date(year, month - 1, day);
    setCurrentDate(newDate);
  };

  const dayPropGetter = (date) => {
    const cellDate = moment(date);
    const leadsOnDate = leadData.filter((lead) => {
      const eventDate = moment(lead.start);
      return (
        cellDate.date() === eventDate.date() &&
        cellDate.month() === eventDate.month() &&
        cellDate.year() === eventDate.year()
      );
    });

    if (leadsOnDate.length > 1) {
      return {
        className: 'red-line-cell',
        'data-status': `Multiple Leads (${leadsOnDate.length})`,
      };
    }

    return {};
  };

  const handleEventClick = (event) => {
    const clickedDate = moment(event.start).startOf('day');
    const filteredLeads = leadData.filter((lead) => {
      const leadDate = moment(lead.start).startOf('day');
      return leadDate.isSame(clickedDate);
    });

    setIsPopupOpen(true);
    setPopupLeads(filteredLeads);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.installStatus ? InstallColors[event.installStatus] || '#CCCCCC' : '#CCCCCC';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: 'white',
        padding: '2px',
        fontSize: '12px',
      },
    };
  };

  return (
    <div style={{ padding: '20px', height: '500px' }}>
      {isLoading && (
        <div className="loader">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="search-form">
        <label className="search-label">
          <span>Year</span>
          <div className="input-wrapper">
            <input
              type="number"
              name="year"
              value={searchDate.year}
              onChange={handleSearchDateChange}
              placeholder="YYYY"
            />
            <span 
              className="date-picker-icon"
              onClick={() => document.getElementById('datePicker').showPicker()}
            >
              📅
            </span>
          </div>
        </label>

        <label className="search-label">
          <span>Month</span>
          <input
            type="number"
            name="month"
            value={searchDate.month}
            onChange={handleSearchDateChange}
            min="1"
            max="12"
            placeholder="MM"
          />
        </label>

        <label className="search-label">
          <span>Day</span>
          <input
            type="number"
            name="day"
            value={searchDate.day}
            onChange={handleSearchDateChange}
            min="1"
            max="31"
            placeholder="DD"
          />
        </label>

        <input
          type="date"
          id="datePicker"
          style={{ display: 'none' }}
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            setSearchDate({
              year: selectedDate.getFullYear(),
              month: selectedDate.getMonth() + 1,
              day: selectedDate.getDate(),
            });
          }}
        />

        <button type="submit" className="submit-button">Go to Date</button>
      </form>

      {!isLoading && (
        <Calendar
          localizer={localizer}
          events={leadData}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month', 'week', 'day']}
          date={currentDate}
          onNavigate={handleNavigate}
          onSelectEvent={handleEventClick}
          selectable
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventStyleGetter}
          components={{
            event: ({ event }) => (
              <div
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className="status-bar">
                  <span>{event.title}</span>
                </div>
              </div>
            ),
          }}
        />
      )}

      {isPopupOpen && (
        <div className="popup">
          <h3>Leads for {moment(popupLeads[0]?.start).format('YYYY-MM-DD')}</h3>
          <button onClick={closePopup} className="close-button">×</button>
          <div className="popup-content">
            {popupLeads.map((lead) => (
              <div key={lead.id} className="lead-card">
                <div><strong>Lead ID:</strong> {lead.lead_id}</div>
                {/* <div><strong>Created:</strong> {moment(lead.start).format('YYYY-MM-DD')}</div> */}
                {lead.installStatus && (
                  <div><strong>Install Status:</strong> {lead.installStatus}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="status-legend">
        <div className="status-column">
          <strong>Install Statuses:</strong>
          {Object.entries(InstallColors).map(([title, color]) => (
            <div key={title} className="status-item">
              <div className="status-color" style={{ backgroundColor: color }}></div>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .loader {
            position: fixed;
            top: 50%;
            left: 60%;
            transform: translate(-50%, -50%);
            z-index: 1000;
          }

          .search-form {
            margin-bottom: 20px;
            display: flex;
            align-items: flex-end;
            gap: 16px;
            font-family: 'Inter, sans-serif';
            flex-wrap: wrap;
          }

          .search-label {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .input-wrapper {
            position: relative;
          }

          .input-wrapper input {
            width: 100px;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            outline: none;
            font-size: 14px;
            color: #1f2937;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .date-picker-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            cursor: pointer;
          }

          .submit-button {
            padding: 10px 20px;
            background-color: #3b82f6;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s, transform 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .submit-button:hover {
            transform: scale(1.05);
          }

          .submit-button:active {
            transform: scale(1);
          }

          .status-bar {
            border-radius: 5px;
            margin-bottom: -2px;
            color: white;
            padding: 2px;
          }

          .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
          }

          .close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
          }

          .popup-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
          }

          .lead-card {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .lead-card:hover {
            transform: scale(1.02);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }

          .status-legend {
            border: 1px solid grey;
            display: flex;
            padding: 10px;
            height: 120px;
            overflow-y: auto;
            margin-top: 20px;
            border-radius: 10px;
          }

          .status-column {
            width: 100%;
            padding-right: 10px;
            font-size: 12px;
          }

          .status-item {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }

          .status-color {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border: 1px solid #ccc;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .red-line-cell {
            position: relative;
          }

          .red-line-cell::after {
            content: attr(data-status);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: black;
            color: white;
            padding: 2px 8px;
            font-size: 12px;
            font-weight: bold;
            border-radius: 4px;
            z-index: 1;
            width: 100%;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
};

export default InstallCalender;