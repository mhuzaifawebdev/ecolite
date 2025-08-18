import React, { useState } from "react";
import { createJob, getJobById, updateJobs } from "../../Config/api.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import { extractFormData } from "../../utils/forms.utils.js";
import { leadFormLiterals } from "../../utils/initialStates.js";

import PreQualification from './Tabs/preQualificationDocuments.jsx';
import RdSAP from "./Tabs/RdSAP.jsx";
import LeadFormTabs from "./LeadFormTabs.jsx";
import LeadInformation from "./Tabs/LeadInformation.jsx";

export default function LeadFormPage() {
    const router = useNavigate();
    const { id } = useParams();
    const [field, setFields] = React.useState(leadFormLiterals);

    const [leadId, setLeadId] = useState(id || null);
    // const [isDraftSaved, setIsDraftSaved] = useState(false);
    // const [sysLogs, setSysLogs] = React.useState([]);
    const formRef = React.useRef(null);
    const [step, setStep] = React.useState(1);

    const [files, setFiles] = React.useState([]);
    const [Docs, setDocs] = React.useState([]);

    React.useEffect(() => {
        if (id) {
            getJobById(id).then((res) => {
                setFields(res.data);
                setFiles(res.data.images);
                if (res.data.docs) {
                    setDocs(res.data.docs);
                }
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = extractFormData(e, ['notes']);

        try {
            form.images = files;
            form.docs = Docs;

            if (leadId) {
                form.id = leadId;
                const res = await updateJobs(form);
                if (res.status === true) {
                    toast.success(res.message);
                    setTimeout(() => {
                        router('/csv');
                    }, 2000);
                } else {
                    toast.error(res.response.data.message);
                }
            } else {
                const res = await createJob(form);
                if (res.status === true) {
                    setLeadId(res.data.id);
                    toast.success(res.message);
                    setTimeout(( ) => {
                        router('/csv');
                    }, 2000);
                } else {
                    toast.error(res.response.data.message);
                }
            }
        } catch (error) {
            toast.error('Error uploading image or submitting form');
            console.error('Error uploading image or submitting form', error);
        }
    };

    // const debounceTimeout = useRef(null);

    // Removed the formChange handler since it's not needed without auto-save

    // const handleAutoSave = async (formData) => {
    //     try {
    //         formData.images = files;
    //         formData.docs = Docs;

    //         let res;

    //         if (leadId) {
    //             formData.id = leadId;
    //             res = await updateJobs(formData);
    //         } else {
    //             res = await createJob(formData);
    //             if (res.status === true) {
    //                 setLeadId(res.data.id);
    //                 router(`/edit-lead/${res.data.id}`, {replace: true});
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error during auto-save:', error);
    //     }
    // };

    return (
        <div className="m-8">
            <ToastContainer />
            <h2 className="text-center text-2xl font-bold">{id ? "Edit" : "Create"} Lead Form</h2>
            <LeadFormTabs step={step} setStep={setStep} />
            <form ref={formRef} onSubmit={handleSubmit} className="ml-8">
                <LeadInformation show={step === 1} field={field} files={files} setFiles={setFiles} />

                <PreQualification show={step === 2} title={'Pre-Qualification'} field={field} Docs={Docs} setDocs={setDocs} />

                <RdSAP show={step === 3} title={'RDSAP'} field={field} />

                <div className="flex justify-end mt-4">
                    <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 mt-8 rounded">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}