import PropTypes from "prop-types";

/**
 * PropTypes for FormField component
 */
export const FormFieldProps = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool
};

/**
 * PropTypes for FormDropdown component
 */
export const FormDropdownProps = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string
};

/**
 * PropTypes for FormTextBox component
 */
export const FormTextBoxProps = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    rows: PropTypes.number
};