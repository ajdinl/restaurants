export const validateOrder = (data) => {
    const errors = {};

    if (!data.restaurant_id || data.restaurant_id.trim().length === 0) {
        errors.restaurant_id = 'Restaurant ID is required';
    }

    if (data.number === undefined || data.number === null) {
        errors.number = 'Order number is required';
    } else if (!Number.isInteger(Number(data.number)) || Number(data.number) < 1) {
        errors.number = 'Order number must be a positive integer';
    }

    if (!data.table_id || data.table_id.trim().length === 0) {
        errors.table_id = 'Table ID is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateOrderDish = (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Dish name is required';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Dish name must be at least 2 characters';
    }

    if (!data.quantity) {
        errors.quantity = 'Quantity is required';
    } else {
        const quantity = Number(data.quantity);
        if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1) {
            errors.quantity = 'Quantity must be a positive integer';
        } else if (quantity > 100) {
            errors.quantity = 'Quantity cannot exceed 100';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateOrderUpdate = (data) => {
    const errors = {};

    if (!data.id || data.id.trim().length === 0) {
        errors.id = 'Order ID is required';
    }

    if (!data.items || !Array.isArray(data.items)) {
        errors.items = 'Items must be an array';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
