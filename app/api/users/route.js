import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ApiResponse } from '@/lib/api-response';
import { requireAdmin } from '@/lib/auth-helper';
import { ERROR_MESSAGES } from '@/lib/constants';
import { CreateUserCommand } from '@/commands/user.commands';
import { logError, ValidationError } from '@/lib/error-handler';

export async function GET() {
    try {
        const { error } = await requireAdmin();
        if (error) return error;

        await connectDB();
        const users = await User.find({}).select('-password').lean();

        const formattedUsers = users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
        }));

        return ApiResponse.success(formattedUsers);
    } catch (err) {
        logError(err, 'GET /api/users');
        return ApiResponse.error(ERROR_MESSAGES.SERVER_ERROR);
    }
}

export async function POST(request) {
    try {
        const { error } = await requireAdmin();
        if (error) return error;

        const body = await request.json();

        await connectDB();

        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return ApiResponse.badRequest(ERROR_MESSAGES.USER_EXISTS);
        }

        const command = new CreateUserCommand(body);
        const userResponse = await command.execute(User);

        return ApiResponse.created(userResponse);
    } catch (err) {
        if (err instanceof ValidationError) {
            return ApiResponse.badRequest('Validation failed', err.errors);
        }

        logError(err, 'POST /api/users');
        return ApiResponse.error(ERROR_MESSAGES.SERVER_ERROR);
    }
}
