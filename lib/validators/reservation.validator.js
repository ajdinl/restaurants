const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

const isValidTime = (timeString) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
};

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

    if (!data.table_id || data.table_id.trim().length === 0) {
        errors.table_id = 'Table ID is required';
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

    if (!data.date) {
        errors.date = 'Date is required';
    } else if (!isValidDate(data.date)) {
        errors.date = 'Invalid date format';
    } else {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errors.date = 'Date cannot be in the past';
        }
    }

    if (!data.time) {
        errors.time = 'Time is required';
    } else if (!isValidTime(data.time)) {
        errors.time = 'Invalid time format (HH:MM)';
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

    if (data.table_id !== undefined) {
        if (!data.table_id || data.table_id.trim().length === 0) {
            errors.table_id = 'Table ID cannot be empty';
        }
    }

    if (data.date !== undefined) {
        if (!data.date) {
            errors.date = 'Date cannot be empty';
        } else if (!isValidDate(data.date)) {
            errors.date = 'Invalid date format';
        } else {
            const selectedDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errors.date = 'Date cannot be in the past';
            }
        }
    }

    if (data.time !== undefined) {
        if (!data.time) {
            errors.time = 'Time cannot be empty';
        } else if (!isValidTime(data.time)) {
            errors.time = 'Invalid time format (HH:MM)';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
