import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { ApiResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-helper';
import { CreateOrderCommand, UpdateOrderDishCommand, DeleteOrderCommand } from '@/commands/order.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function POST(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const command = new CreateOrderCommand(body);
        const orderResponse = await command.execute(Order);

        return ApiResponse.created(orderResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/orders');
        return ApiResponse.error('Failed to create order');
    }
}

export async function PUT(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();
        const { id, items } = body;

        await connectDB();

        const command = new UpdateOrderDishCommand(id, items);
        const orderResponse = await command.execute(Order);

        if (!orderResponse) {
            return ApiResponse.notFound('Order not found');
        }

        return ApiResponse.success(orderResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'PUT /api/orders');
        return ApiResponse.error('Failed to update order');
    }
}

export async function DELETE(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectDB();

        const command = new DeleteOrderCommand(id);
        const deleted = await command.execute(Order);

        if (!deleted) {
            return ApiResponse.notFound('Order not found');
        }

        return ApiResponse.success({ message: 'Order deleted successfully' });
    } catch (err) {
        logError(err, 'DELETE /api/orders');
        return ApiResponse.error('Failed to delete order');
    }
}
