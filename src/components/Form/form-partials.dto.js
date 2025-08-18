import PropTypes from "prop-types";

export const FormFieldProps = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string || PropTypes.number ,
    onChange: PropTypes.func,
};

export const FormDropdownProps = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    options: PropTypes.array.isRequired,
    selectedValue: PropTypes.string
}