import { FormDropdownProps, FormFieldProps } from "./form-partials.dto.js";

const LABEL_CLASS = 'block font-medium self-start pr-4 pl-2 -mb-3 ml-4 z-10 text-wrap bg-[#F5F5F5]';
const INPUT_CLASS = 'appearance-none border bg-[#F5F5F5] border-gray-400 rounded-lg w-full p-4 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent';

export const FormField = ({
    id = null,
    label,
    type,
    name,
    placeholder,
    defaultValue,
    className,
    onChange,
    required = false,
    accept = null,
    multiple = false
}) => {
    return (
        <div className="flex flex-col w-full">
            <label className={LABEL_CLASS}>
                {label} {required && <span className='text-red-600 text-xl'>*</span>}
            </label>
            <input
                id={id || name}
                type={type}
                required={required}
                placeholder={placeholder || 'Enter ' + name}
                defaultValue={defaultValue || ''}
                name={name}
                onChange={onChange || null}
                accept={accept || (type === 'file' ? 'image/*' : null)}
                multiple={multiple}
                className={`${INPUT_CLASS} ${className || ''}`}
            />
        </div>
    );
};

export const FormDropdown = ({
    label, 
    name, 
    options = [], 
    defaultValue, 
    value,  // Add controlled value prop
    onChange, 
    required = false,
    placeholder
}) => {
    // Use value if provided (controlled), otherwise defaultValue (uncontrolled)
    const selectValue = value !== undefined ? value : defaultValue;
    
    return (
        <div className="flex flex-col w-full">
            <label className="block font-medium self-start pr-4 pl-2 -mb-3 ml-4 z-10 text-wrap bg-[#F5F5F5]">
                {label} {required && <span className='text-red-600 text-xl'>*</span>}
            </label>
            <select
                name={name}
                onChange={onChange || null}
                className={`${INPUT_CLASS}`}
                value={selectValue || ""} // Use value for controlled component
                required={required}
            >
                <option value="">{placeholder || `Select ${label}`}</option>
                {options?.map((option, idx) => (
                    <option 
                        key={idx}
                        value={option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
export const FormTextBox = ({
    label, 
    name, 
    placeholder, 
    defaultValue, 
    onChange, 
    classes = ''
}) => {
    return (
        <div className={`flex flex-col w-full ${classes}`}>
            <label className={LABEL_CLASS}>{label}</label>
            <textarea
                placeholder={placeholder || 'Enter ' + name}
                defaultValue={defaultValue || ''}
                name={name}
                rows={5}
                onChange={onChange || null}
                className={`${INPUT_CLASS}`}
            />
        </div>
    );
};

// Prop types of components
FormField.propTypes = FormFieldProps;
FormDropdown.propTypes = FormDropdownProps;