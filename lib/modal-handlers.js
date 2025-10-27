import { addItem, updateOrDeleteArrayItem } from '@/services/api.service';

export const handleTableSave = async (table, isAdmin, restaurantId, restaurants, selected) => {
    if ((isAdmin && !table.restaurant_id) || !table.capacity) {
        return { error: 'Please select field' };
    }

    if (!table.restaurant_id) {
        table.restaurant_id = restaurantId;
    }

    if (!table.number) {
        let newTableNumber;
        if (isAdmin) {
            const restaurant = restaurants.find((restaurant) => restaurant.id === table.restaurant_id);
            if (!restaurant) {
                return { error: 'Restaurant not found' };
            }
            const tables = restaurant.tables || [];
            const lastTable = tables[tables.length - 1];
            lastTable ? (newTableNumber = lastTable.number + 1) : (newTableNumber = 1);
        } else {
            const tables = selected.tables;
            const lastTable = tables[tables.length - 1];
            newTableNumber = lastTable ? lastTable.number + 1 : 1;
        }
        table.number = newTableNumber;
    }

    const { data, error } = await addItem('tables', table);
    if (error) {
        console.error('Error adding item:', error);
        return { error };
    }
    return { data };
};

export const handleMenuSave = async (restaurantId, menuNumber) => {
    const { data, error } = await addItem('menu', {
        restaurant_id: restaurantId,
        number: menuNumber,
    });

    if (error) {
        console.error('Error adding item:', error);
        return { error };
    }
    return { data };
};

export const handleOrderSave = async (restaurantId, orderNumbers, tableId) => {
    const orderNumber = orderNumbers && orderNumbers.length > 0 ? Math.max(...orderNumbers) + 1 : 1;

    if (!tableId) {
        return { error: 'Please select table' };
    }

    const { data, error } = await addItem('orders', {
        restaurant_id: restaurantId,
        table_id: tableId,
        number: parseInt(orderNumber),
    });

    if (error) {
        console.error('Error adding item:', error);
        return { error };
    }
    return { data };
};

export const handleDishSave = async (dish, category, selectedItem) => {
    if (!dish.name) {
        return { error: 'Please fill name of the dish' };
    }
    if (category === 'Order Dish' && !dish.quantity) {
        return { error: 'Please fill quantity' };
    }

    const selectedCategory = category === 'Dish' ? 'menu' : 'orders';
    const selectedArray = Array.isArray(selectedItem.items) ? [...selectedItem.items] : [];
    selectedArray.push(dish);

    const { data, error } = await updateOrDeleteArrayItem(selectedCategory, selectedItem.id, selectedArray);

    if (error) {
        console.error('Error adding item:', error);
        return { error };
    }
    return { data };
};

export const handleReservationSave = async (table, restaurantId, restaurants, reservationNumbers) => {
    table.restaurant_id = restaurantId || null;
    table.number = reservationNumbers?.length ? reservationNumbers.pop() + 1 : 1;

    if (table.restaurant_id && restaurants) {
        const restaurant = restaurants.find((restaurant) => restaurant.id === table.restaurant_id);
        if (restaurant) {
            const reservationNumber = (restaurant.reservations?.length || 0) + 1;
            table.number = reservationNumber;
        }
    }

    if (!table.capacity || !table.table_id || !table.status) {
        return { error: 'Please select field' };
    }

    const { data, error } = await addItem('reservations', table);
    if (error) {
        console.error('Error adding item:', error);
        return { error };
    }
    return { data };
};
