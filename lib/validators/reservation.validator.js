export const validateReservation = (data) => {
    const errors = {};

    if (!data.restaurant_id || data.restaurant_id.trim().length === 0) {
        errors.restaurant_id = 'Restaurant ID is required';
    }

    if (data.number === undefined || data.number === null) {
        errors.number = 'Reservation number is required';
    } else if (!Number.isInteger(Number(data.number)) || Number(data.number) < 1) {
        errors.number = 'Reservation number must be a positive integer';
    }

    if (!data.table_number) {
        errors.table_number = 'Table number is required';
    } else if (!Number.isInteger(Number(data.table_number)) || Number(data.table_number) < 1) {
        errors.table_number = 'Table number must be a positive integer';
    }

    if (!data.status || data.status.trim().length === 0) {
        errors.status = 'Status is required';
    } else if (!['Available', 'Reserved'].includes(data.status)) {
        errors.status = 'Status must be either "Available" or "Reserved"';
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

export const validateReservationUpdate = (data) => {
    const errors = {};

    if (!data.id || data.id.trim().length === 0) {
        errors.id = 'Reservation ID is required';
    }

    if (data.status !== undefined) {
        if (!data.status || data.status.trim().length === 0) {
            errors.status = 'Status cannot be empty';
        } else if (!['Available', 'Reserved'].includes(data.status)) {
            errors.status = 'Status must be either "Available" or "Reserved"';
        }
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
