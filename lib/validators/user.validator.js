export const validateUser = (data) => {
    const errors = {};

    if (!data.email || data.email.trim().length === 0) {
        errors.email = 'Email is required';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.email = 'Invalid email format';
        }
    }

    if (!data.password || data.password.length === 0) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    } else if (data.password.length > 100) {
        errors.password = 'Password must be less than 100 characters';
    }

    if (!data.full_name || data.full_name.trim().length === 0) {
        errors.full_name = 'Full name is required';
    } else if (data.full_name.trim().length < 2) {
        errors.full_name = 'Full name must be at least 2 characters';
    } else if (data.full_name.trim().length > 100) {
        errors.full_name = 'Full name must be less than 100 characters';
    }

    if (data.is_admin !== undefined && typeof data.is_admin !== 'boolean') {
        errors.is_admin = 'is_admin must be a boolean';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateUserUpdate = (data) => {
    const errors = {};

    if (data.email !== undefined) {
        if (data.email.trim().length === 0) {
            errors.email = 'Email cannot be empty';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.email = 'Invalid email format';
            }
        }
    }

    if (data.password !== undefined) {
        if (data.password.length === 0) {
            errors.password = 'Password cannot be empty';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        } else if (data.password.length > 100) {
            errors.password = 'Password must be less than 100 characters';
        }
    }

    if (data.full_name !== undefined) {
        if (data.full_name.trim().length === 0) {
            errors.full_name = 'Full name cannot be empty';
        } else if (data.full_name.trim().length < 2) {
            errors.full_name = 'Full name must be at least 2 characters';
        } else if (data.full_name.trim().length > 100) {
            errors.full_name = 'Full name must be less than 100 characters';
        }
    }

    if (data.is_admin !== undefined && typeof data.is_admin !== 'boolean') {
        errors.is_admin = 'is_admin must be a boolean';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
