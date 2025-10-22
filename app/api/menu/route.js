import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { ApiResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-helper';
import { CreateMenuCommand, UpdateDishCommand, DeleteMenuCommand } from '@/commands/menu.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function POST(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const command = new CreateMenuCommand(body);
        const menuResponse = await command.execute(Menu);

        return ApiResponse.created(menuResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/menu');
        return ApiResponse.error('Failed to create menu');
    }
}

export async function PUT(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();
        const { id, items } = body;

        await connectDB();

        const command = new UpdateDishCommand(id, items);
        const menuResponse = await command.execute(Menu);

        if (!menuResponse) {
            return ApiResponse.notFound('Menu not found');
        }

        return ApiResponse.success(menuResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'PUT /api/menu');
        return ApiResponse.error('Failed to update menu');
    }
}

export async function DELETE(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectDB();

        const command = new DeleteMenuCommand(id);
        const deleted = await command.execute(Menu);

        if (!deleted) {
            return ApiResponse.notFound('Menu not found');
        }

        return ApiResponse.success({ message: 'Menu deleted successfully' });
    } catch (err) {
        logError(err, 'DELETE /api/menu');
        return ApiResponse.error('Failed to delete menu');
    }
}
