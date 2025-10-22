export const validateMenu = (data) => {
    const errors = {};

    if (!data.restaurant_id || data.restaurant_id.trim().length === 0) {
        errors.restaurant_id = 'Restaurant ID is required';
    }

    if (data.number === undefined || data.number === null) {
        errors.number = 'Menu number is required';
    } else if (!Number.isInteger(Number(data.number)) || Number(data.number) < 1) {
        errors.number = 'Menu number must be a positive integer';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateDish = (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Dish name is required';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Dish name must be at least 2 characters';
    } else if (data.name.trim().length > 100) {
        errors.name = 'Dish name must be less than 100 characters';
    }

    if (data.ingredients !== undefined) {
        if (!Array.isArray(data.ingredients)) {
            errors.ingredients = 'Ingredients must be an array';
        } else if (data.ingredients.length === 0) {
            errors.ingredients = 'At least one ingredient is required';
        }
    }

    if (data.price !== undefined && data.price !== null) {
        const price = Number(data.price);
        if (isNaN(price) || price < 0) {
            errors.price = 'Price must be a positive number';
        } else if (price > 10000) {
            errors.price = 'Price cannot exceed 10,000';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateMenuUpdate = (data) => {
    const errors = {};

    if (!data.id || data.id.trim().length === 0) {
        errors.id = 'Menu ID is required';
    }

    if (!data.items || !Array.isArray(data.items)) {
        errors.items = 'Items must be an array';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
