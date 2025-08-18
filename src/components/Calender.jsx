import {useState, useEffect, useMemo, useCallback} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {fetchJobs} from '../Config/api.js';

const localized = momentLocalizer(moment);

const statusColors = {
    'New Lead': '#18230F',
    'Waiting for Data Match': '#27391C',
    'Matched': '#255F38',
    'Unverified': '#1F7D53',
    'Waiting for Survey': '#1A3636',
    'Survey Booked': '#40534C',
    'Ready for Installation': '#677D6A',
    'Pending Work': '#D6BD98',
    'EPR': '#240750',
    'Data Match': '#344C64',
    'Job Rejected': '#577B8D',
    'Survey Completed': '#57A6A1',
};

const eprStatusColors = {
    'EPR Assigned': '#371B58',
    'EPR In Review': '#4C3575',
    'EPR Completed': '#5B4B8A',
    'EPR Rejected': '#7858A6',
    'EPR Pending': '#2D4263',
};

const CustomBigCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchDate, setSearchDate] = useState({
        year: moment().year(),
        month: moment().month() + 1,
        day: moment().date(),
    });

    const [leadData, setLeadData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupLeads, setPopupLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeadData = async () => {
            // Check if we have cached data and it's less than 2 minutes old
            const cachedData = localStorage.getItem('calendarLeadData');
            const cachedTimestamp = localStorage.getItem('calendarLeadTimestamp');
            
            if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp) < 120000)) {
                setLeadData(JSON.parse(cachedData));
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetchJobs({
                    all: true,
                    _t: Date.now() // Add cache busting parameter
                });
                 const formattedData = response.jobs.map((lead) => ({
                    id: lead.id,
                    title: `${lead.status} , Lead ID: ${lead.lead_id}`,
                    start: moment(lead.date).tz('UTC').toDate(),
                    end: moment(lead.date).tz('UTC').toDate(),
                    status: lead.status,
                    lead_id: lead.lead_id,
                    date: moment(lead.date).tz('UTC').toDate(),
                    eprStatus: lead.eprStatus,
                    firstName: lead.firstName,
                    lastName: lead.lastName
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

    const handleNavigate = useCallback((newDate) => {
        setCurrentDate(newDate);
    }, []);

    const handleSearchDateChange = (e) => {
        const {name, value} = e.target;
        setSearchDate({...searchDate, [name]: parseInt(value, 10)});
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const {year, month, day} = searchDate;
        const newDate = new Date(year, month - 1, day);
        setCurrentDate(newDate);
    };

    const dayPropGetter = useCallback((date) => {
        const cellDate = moment(date).tz('UTC');
        const leadsOnDate = leadData.filter((lead) => {
            const eventDate = moment(lead.start).tz('UTC');
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
    }, [leadData]);

    const eventPropGetter = useCallback((event) => {
        const color = statusColors[event.status] || '#CCCCCC';
        return {
            style: {
                backgroundColor: color,
                borderRadius: '5px',
                color: 'white',
                padding: '2px',
                fontSize: '12px',
            },
        };
    }, []);

    const handleEventClick = (event) => {
        const clickedDate = moment(event.start).tz('UTC').startOf('day');
        const filteredLeads = leadData.filter((lead) => {
            const leadDate = moment(lead.start).tz('UTC').startOf('day');
            return leadDate.isSame(clickedDate);
        });

        setIsPopupOpen(true);
        setPopupLeads(filteredLeads);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const memoizedLeadData = useMemo(() => leadData, [leadData]);

    return (
        <div style={{padding: '20px', height: '500px'}}>
            {isLoading && (
                <div className="loader"></div>
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
                        <span className="date-picker-icon"
                              onClick={() => document.getElementById('datePicker').showPicker()}>📅</span>
                    </div>
                </label>

                <label className="search-label">
                    <span>Month</span>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            name="month"
                            value={searchDate.month}
                            onChange={handleSearchDateChange}
                            min="1"
                            max="12"
                            placeholder="MM"
                        />
                    </div>
                </label>

                <label className="search-label">
                    <span>Day</span>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            name="day"
                            value={searchDate.day}
                            onChange={handleSearchDateChange}
                            min="1"
                            max="31"
                            placeholder="DD"
                        />
                    </div>
                </label>

                <input
                    type="date"
                    id="datePicker"
                    style={{display: 'none'}}
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
                    localizer={localized}
                    events={memoizedLeadData}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    views={['month', 'week', 'day']}
                    date={currentDate}
                    onNavigate={handleNavigate}
                    selectable
                    onSelectEvent={handleEventClick}
                    dayPropGetter={dayPropGetter}
                    eventPropGetter={eventPropGetter}
                    components={{
                        event: ({event}) => (
                            <div>
                                <div className="status-bar"
                                     style={{background: statusColors[event.status] || '#CCCCCC'}}>
                                    <span>{event.title}</span>
                                </div>
                                {event.eprStatus && (
                                    <div className="epr-status-bar"
                                         style={{background: eprStatusColors[event.eprStatus] || '#E50046'}}>
                                        <span>{event.eprStatus}</span>
                                    </div>
                                )}
                            </div>
                        ),
                    }}
                />
            )}

            {isPopupOpen && (
                <div className="popup">
                    <h3>Leads for {moment(popupLeads[0]?.start).tz('UTC').format('YYYY-MM-DD')}</h3>
                    <button onClick={closePopup} className="close-button">×</button>
                    <div className="popup-content">
                        {popupLeads.map((lead) => (
                            <div key={lead.id} className="lead-card">
                                {lead.lead_id && <div><strong>Lead ID:</strong> {lead.lead_id}</div>}
                                {lead.status && <div><strong>Lead Status:</strong> {lead.status}</div>}
                                {lead.firstName && (
  <div>
    <strong>Name:</strong> {`${lead.firstName} ${lead.lastName}`}
  </div>
)}
                                {lead.eprStatus && <div><strong>EPR Status:</strong> {lead.eprStatus}</div>}
                                {lead.date &&
                                    <div>
                                        {/* <strong>Created:</strong> {moment(lead.date).tz('UTC').format('YYYY-MM-DD')} */}
                                    </div>
                                    }
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="status-legend">
                <div className="status-column">
                    <strong>Lead Statuses:</strong>
                    {Object.entries(statusColors).map(([title, color]) => (
                        <div key={title} className="status-item">
                            <div className="status-color" style={{backgroundColor: color}}></div>
                            <span>{title}</span>
                        </div>
                    ))}
                </div>

                <div className="status-column">
                    <strong>EPR Statuses:</strong>
                    {Object.entries(eprStatusColors).map(([title, color]) => (
                        <div key={title} className="status-item">
                            <div className="status-color" style={{backgroundColor: color}}></div>
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
                            border: 4px solid #f3f3f3;
                            border-top: 4px solid #3b82f6;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
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
                          }
                
                          .epr-status-bar {
                            border-radius: 5px;
                            margin-top: 2px;
                            padding: 2px;
                            color: white;
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
                            width: 50%;
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

export default CustomBigCalendar;