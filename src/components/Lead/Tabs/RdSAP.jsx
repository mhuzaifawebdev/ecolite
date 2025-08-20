import { FormDropdown, FormField, FormTextBox } from "../../Form/form-partials.jsx";
import PropTypes from "prop-types";
import { schemes } from "../../../utils/enums.utils.js";
import { useState, useEffect } from "react";

RdSAP.propTypes = {
    field: PropTypes.object,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onSaveTab: PropTypes.func,   // 👈 added
    onFormDataChange: PropTypes.func // Add this to handle form data changes
};

export default function RdSAP({ title, field = {}, show, onSaveTab, onFormDataChange }) {

    // State to track form data
    const [formData, setFormData] = useState({});
    
    // State for dropdown value to ensure controlled component
    const [schemeValue, setSchemeValue] = useState('');

    // Update form data when field prop changes
    useEffect(() => {
        if (field && Object.keys(field).length > 0) {
            setFormData(field);
            setSchemeValue(field?.scheme || '');
        }
    }, [field]);

    // Collect form data
    const collectFormData = () => {
        const formElements = document.querySelectorAll('[name]');
        const data = {};
        
        formElements.forEach(element => {
            if (element.name && element.value !== undefined) {
                data[element.name] = element.value;
            }
        });
        
        // Ensure scheme dropdown value is included
        if (schemeValue) {
            data.scheme = schemeValue;
        }
        
        // Handle notes array
        if (data.notes_2) {
            data.notes = [...(formData.notes || [])];
            data.notes[2] = data.notes_2;
            delete data.notes_2;
        }
        
        return data;
    };

    // Handle form changes
    const handleFormChange = () => {
        const data = collectFormData();
        setFormData(prev => ({ ...prev, ...data }));
        
        if (onFormDataChange) {
            onFormDataChange(data);
        }
    };

    // Handle scheme dropdown change
    const handleSchemeChange = (e) => {
        const value = e.target.value;
        setSchemeValue(value);
        
        // Update form data immediately
        const updatedFormData = { ...formData, scheme: value };
        setFormData(updatedFormData);
        
        if (onFormDataChange) {
            onFormDataChange(updatedFormData);
        }
    };

    // Handle save tab
    const handleSaveTab = () => {
        const data = collectFormData();
        if (onSaveTab) {
            onSaveTab(data);
        }
    };

    return (
        <div className={show ? 'block' : 'hidden'}>
            <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8'>
                <h2 className="col-span-full text-xl font-bold">{title} Information</h2>

                <FormField 
                    label='Pre EPR' 
                    name='preEpr' 
                    type='text' 
                    placeholder='Pre EPR'
                    defaultValue={field?.preEpr}
                    onChange={handleFormChange}
                />
                <FormField 
                    label='Post EPR' 
                    name='postErp' 
                    type='text' 
                    placeholder='Post EPR'
                    defaultValue={field?.postErp}
                    onChange={handleFormChange}
                />
                <FormField 
                    label='Measures' 
                    name='measures' 
                    type='text' 
                    placeholder='Measures'
                    defaultValue={field?.measures}
                    onChange={handleFormChange}
                />
                <FormField 
                    label='ABS' 
                    name='abs' 
                    type='text' 
                    placeholder='ABS'
                    defaultValue={field?.abs}
                    onChange={handleFormChange}
                />

                <FormDropdown 
                    label='Scheme' 
                    name='scheme' 
                    placeholder='Scheme'
                    value={schemeValue}
                    options={schemes}
                    onChange={handleSchemeChange}
                />
                <FormField 
                    label='Total Area' 
                    name='totalArea' 
                    type='text' 
                    placeholder='Total Area'
                    defaultValue={field?.totalArea}
                    onChange={handleFormChange}
                />
                <FormField 
                    label='EWI & Others' 
                    name='ewi' 
                    type='text' 
                    placeholder='EWI & Others'
                    defaultValue={field?.ewi}
                    onChange={handleFormChange}
                />
                <FormField 
                    label='Important Bits' 
                    name='importantBits' 
                    type='text' 
                    placeholder='Important Bits'
                    defaultValue={field?.importantBits}
                    onChange={handleFormChange}
                />

                <div className="col-span-full">
                    <FormTextBox 
                        label="Notes" 
                        name="notes_2" 
                        placeholder="Enter Notes"
                        defaultValue={field?.notes?.[2]}
                        onChange={handleFormChange}
                    />
                </div>

                {/* ✅ Save button only for this tab */}
                <div className="col-span-full flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleSaveTab}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                    >
                        Save RDSAP
                    </button>
                </div>
            </div>
        </div>
    );
}