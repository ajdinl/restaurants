export const validateTable = (data) => {
    const errors = {};

    if (!data.restaurant_id || data.restaurant_id.trim().length === 0) {
        errors.restaurant_id = 'Restaurant ID is required';
    }

    if (data.number === undefined || data.number === null) {
        errors.number = 'Table number is required';
    } else if (!Number.isInteger(Number(data.number)) || Number(data.number) < 1) {
        errors.number = 'Table number must be a positive integer';
    }

    if (!data.capacity) {
        errors.capacity = 'Capacity is required';
    } else {
        const capacity = Number(data.capacity);
        if (isNaN(capacity) || !Number.isInteger(capacity) || capacity < 1) {
            errors.capacity = 'Capacity must be a positive integer';
        } else if (capacity > 50) {
            errors.capacity = 'Capacity cannot exceed 50';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateTableUpdate = (data) => {
    const errors = {};

    if (!data.id || data.id.trim().length === 0) {
        errors.id = 'Table ID is required';
    }

    if (data.capacity !== undefined) {
        const capacity = Number(data.capacity);
        if (isNaN(capacity) || !Number.isInteger(capacity) || capacity < 1) {
            errors.capacity = 'Capacity must be a positive integer';
        } else if (capacity > 50) {
            errors.capacity = 'Capacity cannot exceed 50';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
