const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateRestaurant = (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Restaurant name is required';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Restaurant name must be at least 2 characters';
    } else if (data.name.trim().length > 100) {
        errors.name = 'Restaurant name must be less than 100 characters';
    }

    if (!data.address || data.address.trim().length === 0) {
        errors.address = 'Address is required';
    } else if (data.address.trim().length < 5) {
        errors.address = 'Address must be at least 5 characters';
    }

    if (!data.phone || data.phone.trim().length === 0) {
        errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]+$/.test(data.phone)) {
        errors.phone = 'Invalid phone number format';
    }

    if (!data.user_id || data.user_id.trim().length === 0) {
        errors.user_id = 'User ID is required';
    } else if (!isValidObjectId(data.user_id)) {
        errors.user_id = 'Invalid User ID format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateRestaurantUpdate = (data) => {
    const errors = {};

    if (data.name !== undefined) {
        if (data.name.trim().length === 0) {
            errors.name = 'Restaurant name cannot be empty';
        } else if (data.name.trim().length < 2) {
            errors.name = 'Restaurant name must be at least 2 characters';
        } else if (data.name.trim().length > 100) {
            errors.name = 'Restaurant name must be less than 100 characters';
        }
    }

    if (data.address !== undefined) {
        if (data.address.trim().length === 0) {
            errors.address = 'Address cannot be empty';
        } else if (data.address.trim().length < 5) {
            errors.address = 'Address must be at least 5 characters';
        }
    }

    if (data.phone !== undefined) {
        if (data.phone.trim().length === 0) {
            errors.phone = 'Phone number cannot be empty';
        } else if (!/^[\d\s\-+()]+$/.test(data.phone)) {
            errors.phone = 'Invalid phone number format';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
