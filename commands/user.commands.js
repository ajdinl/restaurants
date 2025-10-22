import { validateUser, validateUserUpdate } from '@/lib/validators/user.validator';
import { ValidationError } from '@/lib/error-handler';
import bcrypt from 'bcryptjs';

export class CreateUserCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateUser(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(userModel) {
        this.validate();

        const hashedPassword = await bcrypt.hash(this.data.password, 10);

        const user = await userModel.create({
            email: this.data.email.trim().toLowerCase(),
            password: hashedPassword,
            full_name: this.data.full_name.trim(),
            is_admin: this.data.is_admin || false,
        });

        return {
            id: user._id.toString(),
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
        };
    }
}

export class UpdateUserCommand {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateUserUpdate(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(userModel) {
        this.validate();

        const updateData = {};
        if (this.data.email !== undefined) updateData.email = this.data.email.trim().toLowerCase();
        if (this.data.full_name !== undefined) updateData.full_name = this.data.full_name.trim();
        if (this.data.is_admin !== undefined) updateData.is_admin = this.data.is_admin;

        if (this.data.password !== undefined) {
            updateData.password = await bcrypt.hash(this.data.password, 10);
        }

        const user = await userModel.findByIdAndUpdate(this.id, updateData, { new: true, runValidators: true });

        if (!user) {
            return null;
        }

        return {
            id: user._id.toString(),
            email: user.email,
            full_name: user.full_name,
            is_admin: user.is_admin,
        };
    }
}

export class DeleteUserCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(userModel) {
        const user = await userModel.findByIdAndDelete(this.id);
        return user ? true : false;
    }
}
