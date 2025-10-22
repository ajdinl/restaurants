const createUser = async (email, password, user_metadata) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                full_name: user_metadata?.full_name,
                is_admin: user_metadata?.is_admin,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { data: result.data || null, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const getUser = async () => {
    try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (!session || !session.user) {
            return { data: { user: null }, error: null };
        }

        return {
            data: {
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    user_metadata: {
                        full_name: session.user.full_name,
                        is_admin: session.user.is_admin,
                    },
                },
            },
            error: null,
        };
    } catch (error) {
        return { data: { user: null }, error: { message: error.message } };
    }
};

const getAllUsers = async () => {
    try {
        const response = await fetch('/api/users');

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        const users = result.data || [];

        const formattedUsers = users.map((user) => ({
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
        }));

        return { data: formattedUsers, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const fetchRestaurants = async (userId) => {
    try {
        const url = userId ? `/api/restaurants?userId=${userId}` : '/api/restaurants';

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { data: result.data || null, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const fetchRestaurant = async (id) => {
    try {
        const response = await fetch(`/api/restaurants/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { data: result.data || null, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const updateOrDeleteArrayItem = async (category, id, items) => {
    try {
        const response = await fetch(`/api/${category}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, items }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { data: result.data || null, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const deleteItem = async (category, id) => {
    try {
        const response = await fetch(`/api/${category}?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { data: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { data: result.data || null, error: null };
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
};

const addItem = async (category, itemData) => {
    try {
        const response = await fetch(`/api/${category}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { item: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { item: result.data || null, error: null };
    } catch (error) {
        return { item: null, error: { message: error.message } };
    }
};

const updateItem = async (category, id, name, value) => {
    try {
        const response = await fetch(`/api/${category}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, [name]: value }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { item: null, error: { message: errorData.error } };
        }

        const result = await response.json();
        return { item: result.data || null, error: null };
    } catch (error) {
        return { item: null, error: { message: error.message } };
    }
};

export {
    createUser,
    getUser,
    fetchRestaurants,
    deleteItem,
    addItem,
    updateItem,
    updateOrDeleteArrayItem,
    fetchRestaurant,
    getAllUsers,
};
