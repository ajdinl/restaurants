import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { ApiResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-helper';
import {
    CreateReservationCommand,
    UpdateReservationCommand,
    DeleteReservationCommand,
} from '@/commands/reservation.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function POST(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const command = new CreateReservationCommand(body);
        const reservationResponse = await command.execute(Reservation);

        return ApiResponse.created(reservationResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/reservations');
        return ApiResponse.error('Failed to create reservation');
    }
}

export async function PUT(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const body = await request.json();
        const { id, ...updateData } = body;

        await connectDB();

        const command = new UpdateReservationCommand(id, updateData);
        const reservationResponse = await command.execute(Reservation);

        if (!reservationResponse) {
            return ApiResponse.notFound('Reservation not found');
        }

        return ApiResponse.success(reservationResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'PUT /api/reservations');
        return ApiResponse.error('Failed to update reservation');
    }
}

export async function DELETE(request) {
    try {
        const { error } = await requireAuth();
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectDB();

        const command = new DeleteReservationCommand(id);
        const deleted = await command.execute(Reservation);

        if (!deleted) {
            return ApiResponse.notFound('Reservation not found');
        }

        return ApiResponse.success({ message: 'Reservation deleted successfully' });
    } catch (err) {
        logError(err, 'DELETE /api/reservations');
        return ApiResponse.error('Failed to delete reservation');
    }
}
