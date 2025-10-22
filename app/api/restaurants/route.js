import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Menu from '@/models/Menu';
import Table from '@/models/Table';
import Order from '@/models/Order';
import Reservation from '@/models/Reservation';
import { ApiResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-helper';
import { CreateRestaurantCommand } from '@/commands/restaurant.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function GET(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let restaurants;

        if (userId) {
            const restaurant = await Restaurant.findOne({ user_id: userId });

            if (!restaurant) {
                return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
            }

            const [menu, tables, orders, reservations] = await Promise.all([
                Menu.find({ restaurant_id: restaurant._id }),
                Table.find({ restaurant_id: restaurant._id }),
                Order.find({ restaurant_id: restaurant._id }),
                Reservation.find({ restaurant_id: restaurant._id }),
            ]);

            const restaurantData = {
                id: restaurant._id.toString(),
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                user_id: restaurant.user_id.toString(),
                menu: menu.map((m) => ({
                    id: m._id.toString(),
                    number: m.number,
                    items: m.items || [],
                })),
                tables: tables.map((t) => ({
                    id: t._id.toString(),
                    number: t.number,
                    capacity: t.capacity,
                })),
                orders: orders.map((o) => ({
                    id: o._id.toString(),
                    number: o.number,
                    table_number: o.table_number,
                    items: o.items || [],
                })),
                reservations: reservations.map((r) => ({
                    id: r._id.toString(),
                    number: r.number,
                    table_number: r.table_number,
                    status: r.status,
                    capacity: r.capacity,
                })),
            };

            return ApiResponse.success(restaurantData);
        } else {
            restaurants = await Restaurant.find({});

            const restaurantsWithData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    const [menu, tables, orders, reservations] = await Promise.all([
                        Menu.find({ restaurant_id: restaurant._id }),
                        Table.find({ restaurant_id: restaurant._id }),
                        Order.find({ restaurant_id: restaurant._id }),
                        Reservation.find({ restaurant_id: restaurant._id }),
                    ]);

                    return {
                        id: restaurant._id.toString(),
                        name: restaurant.name,
                        address: restaurant.address,
                        phone: restaurant.phone,
                        user_id: restaurant.user_id.toString(),
                        menu: menu.map((m) => ({
                            id: m._id.toString(),
                            number: m.number,
                            items: m.items || [],
                        })),
                        tables: tables.map((t) => ({
                            id: t._id.toString(),
                            number: t.number,
                            capacity: t.capacity,
                        })),
                        orders: orders.map((o) => ({
                            id: o._id.toString(),
                            number: o.number,
                            table_number: o.table_number,
                            items: o.items || [],
                        })),
                        reservations: reservations.map((r) => ({
                            id: r._id.toString(),
                            number: r.number,
                            table_number: r.table_number,
                            status: r.status,
                            capacity: r.capacity,
                        })),
                    };
                })
            );

            return ApiResponse.success(restaurantsWithData);
        }
    } catch (error) {
        logError(error, 'GET /api/restaurants');
        return ApiResponse.error('Failed to fetch restaurants');
    }
}

export async function POST(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const command = new CreateRestaurantCommand(body);
        const restaurantResponse = await command.execute(Restaurant);

        return ApiResponse.created(restaurantResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/restaurants');
        return ApiResponse.error(err.message || 'Failed to create restaurant');
    }
}
