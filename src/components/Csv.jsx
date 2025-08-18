/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { fetchJobs } from "../Config/api.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LeadStatusColors } from "../utils/colors.utils.js";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Csv = () => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ track URL changes

  // Parse URL params every time location.search changes
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      status: params.get('status'),
      dataMatch: params.get('dataMatchStatus'),
      eprStatus: params.get('eprStatus'),
      installStatus: params.get('installStatus')
    };
  }, [location.search]); // ✅ recalc when ?query changes

  const { status, dataMatch, eprStatus, installStatus } = urlParams;

  // Refs for debouncing and request control
  const fetchTimeoutRef = useRef(null);
  const lastFetchParamsRef = useRef('');
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const jobsFetching = useCallback(async (page = 1, search = searchQuery, immediate = false) => {
    const cacheKey = JSON.stringify({
      search,
      status,
      dataMatch,
      eprStatus,
      installStatus,
      page
    });

    if (cacheKey === lastFetchParamsRef.current && loading) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        lastFetchParamsRef.current = cacheKey;
        abortControllerRef.current = new AbortController();

        const queryParams = {
          ...(search && search.trim().length && { text: search.trim() }),
          ...(status && { status }),
          ...(dataMatch && { dataMatch }),
          ...(eprStatus && { eprStatus }),
          ...(installStatus && { installStatus }),
          ...(page && { page })
        };

        console.log(`🔄 Fetching page ${page} with params:`, queryParams);

        const response = await fetchJobs(queryParams);

        if (abortControllerRef.current?.signal.aborted) return;

        if (response?.jobs) {
          setRows(response.jobs);
          setTotalPages(response.totalPages);
          setCurrentPage(response.page);
          console.log(`✅ Loaded ${response.jobs.length} jobs`);
        } else {
          console.warn('No jobs data in response:', response);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    if (immediate) {
      await fetchData();
    } else {
      fetchTimeoutRef.current = setTimeout(fetchData, 300);
    }
  }, [status, dataMatch, eprStatus, installStatus, loading, searchQuery]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      jobsFetching(1, value, false);
    }, 500);
  }, [jobsFetching]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) {
      return;
    }
    setCurrentPage(newPage);
    jobsFetching(newPage, searchQuery, true);
  }, [currentPage, totalPages, searchQuery, jobsFetching]);

  // ✅ Refetch whenever filters (URL params) change
  useEffect(() => {
    jobsFetching(1, '', true);
  }, [status, eprStatus, installStatus, dataMatch]);

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const getStatusColumn = useCallback((row) => {
    let statusValue, colorValue;
    if (status) {
      statusValue = row.status;
      colorValue = LeadStatusColors(row.status);
    } else if (eprStatus) {
      statusValue = row.eprStatus;
      colorValue = LeadStatusColors(row.eprStatus);
    } else if (installStatus) {
      statusValue = row.installStatus;
      colorValue = LeadStatusColors(row.installStatus);
    } else if (dataMatch) {
      statusValue = row.dataMatch;
      colorValue = LeadStatusColors(row.dataMatch);
    } else {
      statusValue = row.status;
      colorValue = LeadStatusColors(row.status);
    }

    return (
      <td className="px-6 py-4" style={{ color: colorValue }}>
        {statusValue}
      </td>
    );
  }, [status, eprStatus, installStatus, dataMatch]);

  const tableHeaders = useMemo(() => {
    const statusHeader = status ? "Lead Status" :
      eprStatus ? "EPR Status" :
      installStatus ? "Install Status" :
      dataMatch ? "Data Match Status" : "Status";

    return ["ID #", "Name", "Postal Code", "Address", "Lead Source", "Created At", "Benefits", statusHeader];
  }, [status, eprStatus, installStatus, dataMatch]);

  const paginationButtons = useMemo(() => {
    return [...Array(totalPages).keys()].map((page) => (
      <button
        key={page + 1}
        onClick={() => handlePageChange(page + 1)}
        disabled={loading}
        className={`px-4 py-2 rounded-md disabled:opacity-50 ${
          currentPage === page + 1 ? "bg-primary text-white" : "bg-gray-200"
        }`}
      >
        {page + 1}
      </button>
    ));
  }, [totalPages, currentPage, loading, handlePageChange]);

  return (
    <div className="w-full mt-5 container px-5 mx-auto sm:pl-0 overflow-auto">
      <ToastContainer />
      <div className="mb-4 flex md:gap-5 gap-3 sm:flex-row flex-col items-center w-full justify-between">
        <div className="flex w-full flex-1 relative">
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            className="w-full md:px-10 px-7 py-1 md:py-2 border rounded-full bg-white text-gray-700"
            placeholder="Search"
            onChange={handleSearchChange}
            disabled={loading}
          />
          <IoIosSearch className="md:w-6 md:h-6 absolute top-2 md:top-2 left-2 text-[#B0B0B0]" />
          {loading && (
            <div className="absolute right-3 top-2">
              <ClipLoader color="#4A90E2" size={20} />
            </div>
          )}
        </div>
        <div className={`${status === 'New Lead' ? '' : 'hidden'} flex gap-2 w-full justify-between sm:max-w-max items-center`}>
          <button
            onClick={() => navigate("/add-lead")}
            className="px-2 py-1 rounded-full text-sm md:px-4 md:py-2 md:text-base flex items-center gap-1 bg-buttonsBg text-white"
          >
            <MdOutlineAddBox className="h-5 w-5 text-white" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-x-scroll shadow-md rounded-lg">
        {loading && rows.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        ) : (
          <>
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs text-[#ffff] p-0 uppercase bg-primary">
                <tr>
                  {tableHeaders.map((col, idx) =>
                    <th key={idx} colSpan={idx === 3 ? 4 : 1} className="px-6 py-5 text-md">
                      {col}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows && rows.map((row, idx) => (
                  <tr key={`${row.id}-${idx}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="p-2 cursor-copy justify-center hover:text-gray-600">
                      <CopyToClipboard 
                        text={row.id} 
                        onCopy={() =>
                          toast.success(`${row.id} Copied to Clipboard`, {
                            position: "top-right",
                            autoClose: 1000,
                          })
                        }
                      >
                        <span className='flex flex-row items-center justify-center gap-1'>
                          {row.lead_id} <FaCopy />
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="px-6 py-4">{row.firstName + " " + row.lastName}</td>
                    <td className="px-6 py-4">{row.postcode}</td>
                    <td className="p-2 cursor-pointer text-blue-700" colSpan={4}>
                      <Link to={`/edit-lead/${row.id}`}>{row.fullAddress}</Link>
                    </td>
                    <td className={`px-6 py-4`}>
                      {row.leadSource !== "other" ? row.leadSource : row.otherLeadSource}
                    </td>
                    <td className="px-6 py-4">{row.createdAt}</td>
                    <td className="px-6 py-4">{row.benefits}</td>
                    {getStatusColumn(row)}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-center items-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex gap-2 mx-4">
                {paginationButtons}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Csv;
