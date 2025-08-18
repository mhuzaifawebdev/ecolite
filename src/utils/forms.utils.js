export const extractFormData = (e, combine = [], deleteFields = []) => {
    const form = new FormData(e.target);
    const formDataObject = {};

    form.forEach((value, key) => {
        // Check if the value is not an empty string
        if (value !== '') {
            if (typeof value === 'object' && value instanceof File && value.size === 0) {
                return delete formDataObject[key];
            } else {
                formDataObject[key] = value;
            }
        }
    });

    // Combine fields
    combine.forEach((field) => {
        const combinedArray = [];
        Object.keys(formDataObject).forEach((key) => {
            const match = key.match(new RegExp(`^${field}_(\\d+)$`));
            if (match) {
                combinedArray.push(formDataObject[key]);
                delete formDataObject[key];
            }
        });
        if (combinedArray.length > 0) {
            formDataObject[field] = combinedArray;
        }
    });

    // Optional: Parse array-like fields that need to be handled as arrays
    if (formDataObject.notes && typeof formDataObject.notes === 'string') {
        try {
            formDataObject.notes = JSON.parse(formDataObject.notes); // Parse string back to array
        } catch (e) {
            formDataObject.notes = [formDataObject.notes]; // If parsing fails, wrap in array
        }
    }

    // Delete unwanted fields
    if (deleteFields) {
        deleteFields.forEach((field) => {
            delete formDataObject[field];
        });
    }

    return formDataObject;
};
