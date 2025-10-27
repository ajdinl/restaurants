import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Menu from '@/models/Menu';
import Table from '@/models/Table';
import Order from '@/models/Order';
import Reservation from '@/models/Reservation';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const restaurant = await Restaurant.findById(params.id);

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const [menu, tables, orders] = await Promise.all([
            Menu.find({ restaurant_id: restaurant._id }),
            Table.find({ restaurant_id: restaurant._id }),
            Order.find({ restaurant_id: restaurant._id }),
        ]);

        return NextResponse.json({
            data: {
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
                    table_id: o.table_id?.toString() || null,
                    table_number: o.table_number || null,
                    items: o.items || [],
                })),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const restaurant = await Restaurant.findByIdAndDelete(params.id);

        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        await Menu.deleteMany({ restaurant_id: params.id });
        await Table.deleteMany({ restaurant_id: params.id });
        await Order.deleteMany({ restaurant_id: params.id });
        await Reservation.deleteMany({ restaurant_id: params.id });

        return NextResponse.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 500 });
    }
}
