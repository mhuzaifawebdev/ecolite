import {FormDropdown, FormField, FormTextBox} from "../../Form/form-partials.jsx";
import {baseUrlImg} from "../../../Config/Urls.js";
import {
    Benefits,
    // eslint-disable-next-line no-unused-vars
    callStatus, dataMatch, eprStatuses, houseType, installationStatuses,
    leadSourceOptions,
    leadStatuses, occupancyType,
    Overview,
    secondAction
} from "../../../utils/enums.utils.js";
import {uploadImage} from "../../../Config/api.js";
import PropTypes from "prop-types";
import imageUploader from  '../../../../public/image/csv_uploads.png';
import { IoIosClose } from "react-icons/io";
import {useState, useEffect, useRef, useCallback} from "react";

// Constants for install statuses that show date field
const INSTALL_STATUSES_WITH_DATE = ['Install Booked', 'Install Pending', 'Install Incomplete', 'Install Completed'];

LeadInformation.propTypes = {
    field: PropTypes.object,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    onFormDataChange: PropTypes.func // Add this to handle form data changes
}

export default function LeadInformation({field = {}, files, setFiles, show, onFormDataChange}) {
    
    // Helper function to format date for HTML date input (YYYY-MM-DD)
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return '';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Helper function to format date for database storage (ISO string)
    const formatDateForStorage = (dateValue) => {
        if (!dateValue) return null;
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return null;
            return date.toISOString();
        } catch (error) {
            console.error('Error formatting date for storage:', error);
            return null;
        }
    };

    // Refs for form inputs to handle controlled values
    const formRef = useRef({});

    // State management
    const [isOtherLeadSource, setIsOtherLeadSource] = useState(field?.leadSource === 'other');
    const [isOtherInstall, setIsOtherInstall] = useState(() => {
        return INSTALL_STATUSES_WITH_DATE.includes(field?.installStatus);
    });

    // State to track form data
    const [formData, setFormData] = useState({});
    
    // Individual states for dropdown values to ensure controlled components
    const [dropdownValues, setDropdownValues] = useState({
        leadSource: '',
        benefits: '',
        status: '',
        dataMatchStatus: '',
        eprStatus: '',
        installStatus: '',
        afterCallStatus: '',
        secondAction: '',
        overView: '',
        occupancy: ''
    });

    // Update form data when field prop changes
    useEffect(() => {
        console.log('Field data received:', field); // Debug log
        
        if (field && Object.keys(field).length > 0) {
            setFormData(field);
            
            // Update dropdown values with better logging
            const newDropdownValues = {
                leadSource: field?.leadSource || '',
                benefits: field?.benefits || '',
                status: field?.status || leadStatuses?.[0]?.value || '',
                dataMatchStatus: field?.dataMatchStatus || '',
                eprStatus: field?.eprStatus || '',
                installStatus: field?.installStatus || '',
                afterCallStatus: field?.afterCallStatus || '',
                secondAction: field?.secondAction || '',
                overView: field?.overView || '',
                occupancy: field?.occupancy || ''
            };
            
            console.log('Setting dropdown values:', newDropdownValues); // Debug log
            setDropdownValues(newDropdownValues);
            
            // Set form values using refs to ensure they persist
            if (formRef.current.dob && field.dob) {
                formRef.current.dob.value = formatDateForInput(field.dob);
            }
            if (formRef.current.date && field.date) {
                formRef.current.date.value = formatDateForInput(field.date);
            }
            if (formRef.current.installDate && field.installDate) {
                formRef.current.installDate.value = formatDateForInput(field.installDate);
            }

            setIsOtherLeadSource(field?.leadSource === 'other');
            setIsOtherInstall(INSTALL_STATUSES_WITH_DATE.includes(field?.installStatus));
        } else {
            console.log('No field data or empty field data'); // Debug log
        }
    }, [field]);

    // Collect form data - memoized for performance
    const collectFormData = useCallback(() => {
        const formElements = document.querySelectorAll('[name]');
        const data = {};
        
        formElements.forEach(element => {
            if (element.name && element.value !== undefined) {
                if (element.type === 'date') {
                    data[element.name] = formatDateForStorage(element.value);
                } else {
                    data[element.name] = element.value;
                }
            }
        });
        
        // Ensure dropdown values are included in the data (include all, even empty values)
        Object.keys(dropdownValues).forEach(key => {
            data[key] = dropdownValues[key] || '';
        });
        
        console.log('Collected form data with dropdowns:', data); // Debug log
        
        // Handle notes array
        if (data.notes_0) {
            data.notes = [...(formData.notes || [])];
            data.notes[0] = data.notes_0;
            delete data.notes_0;
        }
        
        return data;
    }, [formData.notes, dropdownValues]);

    // Handle form changes - memoized for performance
    const handleFormChange = useCallback(() => {
        const data = collectFormData();
        setFormData(prev => ({ ...prev, ...data }));
        
        if (onFormDataChange) {
            onFormDataChange(data);
        }
    }, [collectFormData, onFormDataChange]);

    // Handle dropdown value changes
    const handleDropdownChange = useCallback((name, value) => {
        console.log(`Dropdown change: ${name} = ${value}`); // Debug log
        
        setDropdownValues(prev => {
            const updated = {
                ...prev,
                [name]: value
            };
            console.log('Updated dropdown values:', updated); // Debug log
            return updated;
        });
        
        // Use functional update to avoid stale closure
        setFormData(prev => {
            const updatedFormData = { ...prev, [name]: value };
            console.log('Sending form data:', updatedFormData); // Debug log
            
            if (onFormDataChange) {
                onFormDataChange(updatedFormData);
            }
            
            return updatedFormData;
        });
    }, [onFormDataChange]);

    // File handling functions - memoized for performance
    const handleFileChange = useCallback(async (e) => {
        const imgFile = e.target.files[0];
        if (!imgFile) return;
        
        try {
            const upload = await uploadImage(imgFile);
            console.log('Uploaded Image before URL:', upload);

            if (upload.url) {
                console.log('Uploaded Image URL:', upload);
                const filesData = [...files, upload.url];
                setFiles(filesData);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // You might want to show an error message to the user here
        }
    }, [files, setFiles]);

    const handleFilesDelete = useCallback((index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    }, [files, setFiles]);

    const handleAddNewFile = useCallback(() => {
        document.getElementById('img-upload').click();
    }, []);

    const handleLeadSourceChange = useCallback((e) => {
        const value = e.target.value;
        setIsOtherLeadSource(value === 'other');
        handleDropdownChange('leadSource', value);
    }, [handleDropdownChange]);

    const handleInstallStatusChange = useCallback((e) => {
        const selectedValue = e.target.value;
        const shouldShowInstallDate = INSTALL_STATUSES_WITH_DATE.includes(selectedValue);
        
        setIsOtherInstall(shouldShowInstallDate);
        
        // Clear install date if status doesn't require it
        if (!shouldShowInstallDate && formRef.current.installDate) {
            formRef.current.installDate.value = '';
        }
        
        handleDropdownChange('installStatus', selectedValue);
    }, [handleDropdownChange]);

    return <div className={show ? 'block' : 'hidden'}>
        <div>
            <div className="col-span-full">
                <FormField
                    className={'hidden'}
                    id={'img-upload'}
                    label=""
                    name={''}
                    multiple={true}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                />

                <div className="flex flex-row gap-5 flex-wrap">
                    <img
                        src={imageUploader || ''} 
                        onClick={handleAddNewFile}
                        alt="Upload Image"
                        className="w-[100px] h-[100px] mt-5 cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    {files.length > 0 && files.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={`${baseUrlImg}/${img}`} 
                                alt="Uploaded"
                                className="w-[100px] mt-5 rounded-full h-[100px] object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleFilesDelete(idx)}
                                className={`absolute top-1 rounded-2xl right-1 bg-primary mt-4 -mr-2 text-white hover:bg-primary-dark transition-colors`}
                            >
                                <IoIosClose className={'w-[30px] h-[30px]'}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {/* Lead Form Content */}
                <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8'>
                    <h2 className="col-span-full text-xl font-bold">Lead Information</h2>
                    
                    <FormField 
                        label='Full Address' 
                        name='fullAddress' 
                        type='text' 
                        required={true}
                        placeholder='Enter Full Address'
                        defaultValue={field?.fullAddress}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='First Name' 
                        name='firstName' 
                        type='text' 
                        placeholder='Enter First Name'
                        required={true}
                        defaultValue={field?.firstName}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Middle Name' 
                        name='middleName' 
                        type='text' 
                        placeholder='Enter Middle Name'
                        defaultValue={field?.middleName}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Last Name' 
                        name='lastName' 
                        type='text' 
                        placeholder='Enter Last Name'
                        required={true}
                        defaultValue={field?.lastName}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Postcode' 
                        name='postcode' 
                        type='text' 
                        placeholder='Enter Postcode' 
                        required={true}
                        defaultValue={field?.postcode}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Contact Number' 
                        name='contactNumber' 
                        type='tel' 
                        required={true}
                        placeholder='Enter Contact Number'
                        defaultValue={field?.contactNumber}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Email' 
                        name='email' 
                        type='email' 
                        placeholder='Email'
                        defaultValue={field?.email}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='DOB' 
                        name='dob' 
                        type='date' 
                        defaultValue={formatDateForInput(field?.dob)}
                        onChange={handleFormChange}
                        id="dob"
                        ref={el => formRef.current.dob = el}
                    />

                    <FormDropdown 
                        label='Lead Source' 
                        name='leadSource' 
                        required={true} 
                        onChange={handleLeadSourceChange}
                        options={leadSourceOptions} 
                        value={dropdownValues.leadSource}
                    />
                    
                    {(field?.leadSource === 'other' || isOtherLeadSource) && (
                        <FormField 
                            label='Other Lead Source' 
                            name='otherLeadSource'
                            type='text' 
                            placeholder='Enter Other Lead Source'
                            defaultValue={field?.otherLeadSource}
                            onChange={handleFormChange}
                            required={true}
                        />
                    )}
                    
                    <FormDropdown 
                        label='Benefits' 
                        name='benefits' 
                        options={Benefits} 
                        required={true}
                        value={dropdownValues.benefits}
                        onChange={(e) => handleDropdownChange('benefits', e.target.value)}
                    />

                    <FormField 
                        label='Survey Date' 
                        name='date' 
                        type='date' 
                        placeholder='Enter Date' 
                        required={true}
                        defaultValue={formatDateForInput(field?.date)}
                        onChange={handleFormChange}
                        id="date"
                        ref={el => formRef.current.date = el}
                    />
                    
                    <h2 className="col-span-full text-xl font-bold">Statuses</h2>
                    
                    <FormDropdown 
                        label='Lead Status' 
                        name='status' 
                        options={leadStatuses} 
                        required={true}
                        value={dropdownValues.status}
                        onChange={(e) => handleDropdownChange('status', e.target.value)}
                    />
                    
                    <FormDropdown 
                        label='Data Match' 
                        name='dataMatchStatus' 
                        options={dataMatch} 
                        required={true}
                        value={dropdownValues.dataMatchStatus}
                        onChange={(e) => handleDropdownChange('dataMatchStatus', e.target.value)}
                    />
                    
                    <FormDropdown 
                        label='EPR Status' 
                        name='eprStatus' 
                        options={eprStatuses} 
                        required={true}
                        value={dropdownValues.eprStatus}
                        onChange={(e) => handleDropdownChange('eprStatus', e.target.value)}
                    />
                    
                    <FormDropdown
                        label='Install Status'
                        name='installStatus'
                        options={installationStatuses}
                        required={true}
                        value={dropdownValues.installStatus}
                        onChange={handleInstallStatusChange}
                    />

                    {((field?.installStatus && INSTALL_STATUSES_WITH_DATE.includes(field?.installStatus)) || isOtherInstall) && (
                        <FormField
                            label='Install Date'
                            name='installDate'
                            type='date'
                            placeholder='Enter Install Date'
                            defaultValue={formatDateForInput(field?.installDate)}
                            onChange={handleFormChange}
                            required={true}
                            id="installDate"
                            ref={el => formRef.current.installDate = el}
                        />
                    )}

                    <h2 className="col-span-full text-xl font-bold">Post Call Status</h2>
                    
                    <FormDropdown 
                        label='After Call Status' 
                        name='afterCallStatus' 
                        placeholder='After Call Status' 
                        options={callStatus}
                        value={dropdownValues.afterCallStatus}
                        onChange={(e) => handleDropdownChange('afterCallStatus', e.target.value)}
                    />
                    
                    <FormDropdown 
                        label='Second Action' 
                        name='secondAction' 
                        placeholder='Second Action' 
                        options={secondAction}
                        value={dropdownValues.secondAction}
                        onChange={(e) => handleDropdownChange('secondAction', e.target.value)}
                    />
                    
                    <FormDropdown 
                        label='Overview' 
                        name='overView' 
                        placeholder='Overview'
                        options={Overview}
                        value={dropdownValues.overView}
                        onChange={(e) => handleDropdownChange('overView', e.target.value)}
                    />
                    
                    <FormField 
                        label='Reminder' 
                        name='reminder' 
                        type='text' 
                        placeholder='Reminder'
                        defaultValue={field?.reminder}
                        onChange={handleFormChange}
                    />
                    
                    <h2 className="col-span-full text-xl font-bold">Pre Checks</h2>
                    
                    <FormDropdown 
                        label='Occupancy' 
                        name='occupancy' 
                        options={occupancyType}
                        value={dropdownValues.occupancy}
                        onChange={(e) => handleDropdownChange('occupancy', e.target.value)}
                    />
                    
                    <FormField 
                        label='EPC' 
                        name='epc' 
                        type='text' 
                        placeholder='Enter EPC'
                        defaultValue={field?.epc}
                        onChange={handleFormChange}
                    />
                    
                    <FormField 
                        label='Gas Safe' 
                        name='gasSafe' 
                        type='text' 
                        placeholder='Enter Gas Safe'
                        defaultValue={field?.gasSafe}
                        onChange={handleFormChange}
                    />

                    <div className={'col-span-full'}>
                        <FormTextBox 
                            label={'Notes'} 
                            name={'notes_0'} 
                            placeholder={'Enter Notes'}
                            defaultValue={field?.notes?.[0]}
                            onChange={handleFormChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
}