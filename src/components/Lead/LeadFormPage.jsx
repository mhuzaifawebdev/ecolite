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
    const formRef = React.useRef(null);
    const [step, setStep] = React.useState(1);
    const [tabChanges, setTabChanges] = useState({
        1: false,
        2: false,
        3: false
    });
    const hasUnsavedChanges = tabChanges[step];

    const [files, setFiles] = React.useState([]);
    const [Docs, setDocs] = React.useState([]);
    const [initialDataLoaded, setInitialDataLoaded] = React.useState(false);

    React.useEffect(() => {
        if (id) {
            getJobById(id).then((res) => {
                setFields(res.data);
                setFiles(res.data.images || []);
                if (res.data.docs) {
                    setDocs(res.data.docs);
                }
                setTimeout(() => setInitialDataLoaded(true), 100);
            });
        } else {
            setInitialDataLoaded(true);
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = extractFormData(e, ['notes']);

        try {
            form.images = files;
            form.docs = Docs;

            setTabChanges({ 1: false, 2: false, 3: false });

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
                    setTimeout(() => {
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

    const handleFormChange = (tabNumber = step) => {
        setTabChanges(prev => ({ ...prev, [tabNumber]: true }));
    };

    React.useEffect(() => {
        if (initialDataLoaded && files && files.length > 0) {
            handleFormChange(1);
        }
    }, [files, initialDataLoaded]);

    React.useEffect(() => {
        if (initialDataLoaded && Docs && Docs.length > 0) {
            handleFormChange(2);
        }
    }, [Docs, initialDataLoaded]);

    const handleSaveCurrentTab = async () => {
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const form = {};
        for (let [key, value] of formData.entries()) {
            form[key] = value;
        }

        try {
            form.images = files;
            form.docs = Docs;

            if (leadId) {
                form.id = leadId;
                const res = await updateJobs(form);
                if (res.status === true) {
                    toast.success("Changes saved successfully");
                    setTabChanges(prev => ({ ...prev, [step]: false }));
                } else {
                    toast.error(res.response.data.message);
                }
            } else {
                const res = await createJob(form);
                if (res.status === true) {
                    setLeadId(res.data.id);
                    toast.success("Changes saved successfully");
                    setTabChanges(prev => ({ ...prev, [step]: false }));
                    window.history.replaceState(null, '', `/edit-lead/${res.data.id}`);
                } else {
                    toast.error(res.response.data.message);
                }
            }
        } catch (error) {
            toast.error('Error saving changes');
            console.error('Error saving changes', error);
        }
    };

    const handleContinueWithoutSaving = () => {
        setTabChanges({ 1: false, 2: false, 3: false });
    };

    return (
        <div className="m-8">
            <ToastContainer />
            <h2 className="text-center text-2xl font-bold">{id ? "Edit" : "Create"} Lead Form</h2>
            <LeadFormTabs
                step={step}
                setStep={setStep}
                hasUnsavedChanges={hasUnsavedChanges}
                formRef={formRef}
                onSaveData={handleSaveCurrentTab}
                onContinueWithoutSaving={handleContinueWithoutSaving}
            />
           <form
    ref={formRef}
    onSubmit={handleSubmit}
    onChange={() => handleFormChange()}
    className="ml-8"
>
    <LeadInformation
        show={step === 1}
        field={field}
        files={files}
        setFiles={(newFiles) => {
            setFiles(newFiles);
            handleFormChange(1);
        }}
    />

    <PreQualification
        show={step === 2}
        title={'Pre-Qualification'}
        field={field}
        Docs={Docs}
        setDocs={(newDocs) => {
            setDocs(newDocs);
            handleFormChange(2);
        }}
        onChange={() => handleFormChange(2)}
        onSaveTab={handleSaveCurrentTab}
    />

    <RdSAP
        show={step === 3}
        title={'RDSAP'}
        field={field}
        onChange={() => handleFormChange(3)}
        onSaveTab={handleSaveCurrentTab}
    />

    {/* ✅ Submit button only when step = 1 */}
    {step === 1 && (
        <div className="flex justify-end mt-4">
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 mt-8 rounded"
            >
                Submit
            </button>
        </div>
    )}
</form>

        </div>
    );
}
