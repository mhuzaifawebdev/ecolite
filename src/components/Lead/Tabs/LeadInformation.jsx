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
import {useState} from "react";

LeadInformation.propTypes = {
    field: PropTypes.object,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
}

export default function LeadInformation({field = {}, files, setFiles, show}) {

    const handleFileChange = async (e) => {
        const imgFile = e.target.files[0];
        if (!imgFile) return;
        const upload = await uploadImage(imgFile);
        console.log('Uploaded Image before URL:', upload);

        if (upload.url) {
            console.log('Uploaded Image URL:', upload);
            const filesData = [...files, upload.url];
            setFiles(filesData);
        }
    };

    const handleFilesDelete = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };
    const handleAddNewFile = () => {
        document.getElementById('img-upload').click();
    }

    const [isOtherLeadSource, setIsOtherLeadSource] = useState(false);
    const [isOtherInstall, setIsOtherInstall] = useState(false);


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
                    onChange={(e) => handleFileChange(e)}
                />

                <div className="flex flex-row gap-5">
                    <img
                        src={imageUploader || ''} // Assuming `imageUploader` is the placeholder image
                        onClick={handleAddNewFile}
                        alt="Upload Image"
                        className="w-[100px] h-[100px] mt-5 cursor-pointer"
                    />

                    {files.length > 0 && files.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={`${baseUrlImg}/${img}`} // Using the base URL to display images
                                alt="Uploaded"
                                className="w-[100px] mt-5 rounded-full h-[100px]"
                            />
                            <button
                                type="button"
                                onClick={() => handleFilesDelete(idx)}
                                className={`absolute top-1 rounded-2xl right-1 bg-primary mt-4 -mr-2 text-white `}
                            >
                                <IoIosClose  className={'w-[30px] h-[30px]'}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {/* Lead Form Content */}
                <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8'>
                    <h2 className="col-span-full text-xl font-bold">Lead Information</h2>
                    <FormField label='Full Address' name='fullAddress' type='text' required={true}
                               placeholder='Enter Full Address'
                               defaultValue={field?.fullAddress}/>
                    <FormField label='First Name' name='firstName' type='text' placeholder='Enter First Name'
                               required={true}
                               defaultValue={field?.firstName}/>
                    <FormField label='Middle Name' name='middleName' type='text' placeholder='Enter Middle Name'
                               defaultValue={field?.middleName}/>
                    <FormField label='Last Name' name='lastName' type='text' placeholder='Enter Last Name'
                               required={true}
                               defaultValue={field?.lastName}/>
                    <FormField label='Postcode' name='postcode' type='text' placeholder='Enter Postcode' required={true}
                               defaultValue={field?.postcode}/>
                    <FormField label='Contact Number' name='contactNumber' type='number' required={true}
                               placeholder='Enter Contact Number'
                               defaultValue={field?.contactNumber}/>
                    <FormField label='Email' name='email' type='email' placeholder='Email'
                               defaultValue={field?.email}/>
                    <FormField label='DOB' name='dob' type='date' defaultValue={field?.dob}/>

                    <FormDropdown label='Lead Source' name='leadSource' placeholder='Enter Lead Source'
                                  required={true} onChange={(e) => setIsOtherLeadSource(e.target.value === 'other')}
                                  options={leadSourceOptions} defaultValue={field?.leadSource}/>
                    {(field?.leadSource === 'other' || isOtherLeadSource) &&
                        <FormField label='Other Lead Source' name='otherLeadSource'
                                    type='text' placeholder='Enter Other Lead Source'
                                   defaultValue={field?.otherLeadSource} required={true}/>}
                    <FormDropdown label='Benefits' name='benefits' options={Benefits} required={true}
                                  defaultValue={field?.benefits}/>

                    <FormField label='Survey Date' name='date' type='date' placeholder='Enter Date' required={true}
                               defaultValue={field?.date}/>
                    <h2 className="col-span-full text-xl font-bold">Statuses </h2>
                    <FormDropdown label='Lead Status' name='status' options={leadStatuses} required={true}
                                  defaultValue={field?.status || leadStatuses?.[0]?.value}/>
                                   <FormDropdown label='Data Match' name='dataMatchStatus' options={dataMatch} required={true}
                                  defaultValue={field?.dataMatchStatus}/>
                    <FormDropdown label='EPR Status' name='eprStatus' options={eprStatuses} required={true}
                                  defaultValue={field?.eprStatus}/>
                        <FormDropdown
                          label='Install Status'
                          name='installStatus'
                          options={installationStatuses}
                          required={true}
                          defaultValue={field?.installStatus}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const installStatuses = ['Install Booked', 'Install Pending', 'Install Incomplete', 'Install Completed'];
                            setIsOtherInstall(installStatuses.includes(selectedValue));
                          }}
                        />
{/*  */}
                    {((field?.leadSource === 'Install Booked' || field?.leadSource === 'Install Pending' || field?.leadSource === 'Install Incomplete' || field?.leadSource === 'Install Completed' || isOtherInstall) && isOtherInstall !== '') &&
                      <FormField
                        label='Install Date'
                        name='installDate'
                        type='Date'
                        placeholder='Enter Install Date'
                        defaultValue={field?.installDate}
                        required={true}
                      />
                    }
                                  {/*  */}
                    <h2 className="col-span-full text-xl font-bold">Post Call Status</h2>
                    <FormDropdown label='After Call Status' name='afterCallStatus' type='text'
                                  placeholder='After Call Status' options={callStatus}
                                  defaultValue={field?.afterCallStatus}/>
                    <FormDropdown label='Second Action' name='secondAction' type='text'
                                  placeholder='Second Action' options={secondAction}
                                  defaultValue={field?.secondAction}/>
                    <FormDropdown label='Overview' name='overView' type='text' placeholder='Overview'
                                  options={Overview}
                                  defaultValue={field?.overView}/>
                    <FormField label='Reminder' name='reminder' type='text' placeholder='Reminder'
                               defaultValue={field?.reminder}/>
                    <h2 className="col-span-full text-xl font-bold">Pre Checks </h2>
                    <FormDropdown label='Occupancy' name='occupancy' options={occupancyType}
                                  defaultValue={field?.occupancy}/>
                    <FormField label='EPC' name='epc' type='text' placeholder='Enter EPC'
                               defaultValue={field?.epc}/>
                    <FormField label='Gas Safe' name='gasSafe' type='text' placeholder='Enter Gas Safe'
                               defaultValue={field?.gasSafe}/>

                    <div className={'col-span-full'}>
                        <FormTextBox label={'Notes'} name={'notes_0'} placeholder={'Enter Notes'}
                                     defaultValue={field?.notes[0]}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}