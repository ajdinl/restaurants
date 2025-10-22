export const VALIDATION_MESSAGES = {
    REQUIRED: {
        NAME: 'Name is required',
        EMAIL: 'Email is required',
        PASSWORD: 'Password is required',
        FULL_NAME: 'Full name is required',
        ADDRESS: 'Address is required',
        PHONE: 'Phone number is required',
        RESTAURANT_ID: 'Restaurant ID is required',
        USER_ID: 'User ID is required',
        TABLE_NUMBER: 'Table number is required',
        CAPACITY: 'Capacity is required',
        STATUS: 'Status is required',
        NUMBER: 'Number is required',
        QUANTITY: 'Quantity is required',
    },
    FORMAT: {
        EMAIL: 'Invalid email format',
        PHONE: 'Invalid phone number format',
    },
    LENGTH: {
        MIN_2: 'Must be at least 2 characters',
        MIN_5: 'Must be at least 5 characters',
        MIN_6: 'Must be at least 6 characters',
        MAX_50: 'Must be less than 50 characters',
        MAX_100: 'Must be less than 100 characters',
    },
    NUMBER: {
        POSITIVE: 'Must be a positive number',
        POSITIVE_INTEGER: 'Must be a positive integer',
        MAX_50: 'Cannot exceed 50',
        MAX_100: 'Cannot exceed 100',
        MAX_10000: 'Cannot exceed 10,000',
    },
    TYPE: {
        BOOLEAN: 'Must be a boolean',
        ARRAY: 'Must be an array',
    },
    CUSTOM: {
        EMPTY_ARRAY: 'At least one item is required',
        INVALID_STATUS: 'Status must be either "Available" or "Reserved"',
    },
};
