export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const API_ROUTES = {
    USERS: '/api/users',
    RESTAURANTS: '/api/restaurants',
    MENU: '/api/menu',
    TABLES: '/api/tables',
    ORDERS: '/api/orders',
    RESERVATIONS: '/api/reservations',
};

export const AUTH_ROUTES = {
    SIGN_IN: '/',
    SIGN_OUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
};

export const APP_ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/admin-dashboard',
};

export const VIEW_TYPES = {
    MENU: 'menu',
    TABLES: 'tables',
    ORDERS: 'orders',
    RESERVATIONS: 'reservations',
    RESTAURANTS: 'restaurants',
    CREATE: 'create',
};

export const MODAL_CATEGORIES = {
    MENU: 'Menu',
    DISH: 'Dish',
    TABLE: 'Table',
    ORDER: 'Order',
    ORDER_DISH: 'Order Dish',
    RESERVATION: 'Reservation',
};

export const RESERVATION_STATUS = {
    AVAILABLE: 'Available',
    RESERVED: 'Reserved',
};

export const LOADING_SPINNER_SIZES = {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
};

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Resource not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    MISSING_FIELDS: 'Missing required fields',
    USER_EXISTS: 'User already exists',
    SERVER_ERROR: 'Internal server error',
    FAILED_TO_FETCH: 'Failed to fetch data',
    FAILED_TO_CREATE: 'Failed to create item',
    FAILED_TO_UPDATE: 'Failed to update item',
    FAILED_TO_DELETE: 'Failed to delete item',
};

export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    RESTAURANT_CREATED: 'Restaurant created successfully',
    ITEM_CREATED: 'Item created successfully',
    ITEM_UPDATED: 'Item updated successfully',
    ITEM_DELETED: 'Item deleted successfully',
    MENU_CREATED: 'Menu created successfully',
    TABLE_CREATED: 'Table created successfully',
    ORDER_CREATED: 'Order created successfully',
    RESERVATION_CREATED: 'Reservation created successfully',
};

export const DEFAULT_VALUES = {
    ITEMS_PER_PAGE: 5,
    MAX_TABLE_CAPACITY: 50,
    MAX_ORDER_QUANTITY: 100,
    MENU_TIMEOUT: 3000,
};
