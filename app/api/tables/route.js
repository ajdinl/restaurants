import connectDB from '@/lib/mongodb';
import Table from '@/models/Table';
import { ApiResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-helper';
import { CreateTableCommand, UpdateTableCommand, DeleteTableCommand } from '@/commands/table.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function POST(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const command = new CreateTableCommand(body);
        const tableResponse = await command.execute(Table);

        return ApiResponse.created(tableResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/tables');
        return ApiResponse.error('Failed to create table');
    }
}

export async function PUT(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();
        const { id, ...updateData } = body;

        await connectDB();

        const command = new UpdateTableCommand(id, updateData);
        const tableResponse = await command.execute(Table);

        if (!tableResponse) {
            return ApiResponse.notFound('Table not found');
        }

        return ApiResponse.success(tableResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'PUT /api/tables');
        return ApiResponse.error('Failed to update table');
    }
}

export async function DELETE(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectDB();

        const command = new DeleteTableCommand(id);
        const deleted = await command.execute(Table);

        if (!deleted) {
            return ApiResponse.notFound('Table not found');
        }

        return ApiResponse.success({ message: 'Table deleted successfully' });
    } catch (err) {
        logError(err, 'DELETE /api/tables');
        return ApiResponse.error('Failed to delete table');
    }
}
