import { validateReservation, validateReservationUpdate } from '@/lib/validators/reservation.validator';
import { ValidationError } from '@/lib/error-handler';

export class CreateReservationCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateReservation(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(reservationModel) {
        this.validate();

        const reservation = await reservationModel.create({
            restaurant_id: this.data.restaurant_id,
            number: Number(this.data.number),
            table_id: this.data.table_id,
            status: this.data.status,
            capacity: Number(this.data.capacity),
        });

        return {
            id: reservation._id.toString(),
            restaurant_id: reservation.restaurant_id.toString(),
            number: reservation.number,
            table_id: reservation.table_id.toString(),
            status: reservation.status,
            capacity: reservation.capacity,
        };
    }
}

export class UpdateReservationCommand {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateReservationUpdate({
            id: this.id,
            ...this.data,
        });
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(reservationModel) {
        this.validate();

        const updateData = {};
        if (this.data.status !== undefined) updateData.status = this.data.status;
        if (this.data.capacity !== undefined) updateData.capacity = Number(this.data.capacity);
        if (this.data.table_id !== undefined) updateData.table_id = this.data.table_id;

        const reservation = await reservationModel.findByIdAndUpdate(this.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!reservation) {
            return null;
        }

        return {
            id: reservation._id.toString(),
            restaurant_id: reservation.restaurant_id.toString(),
            number: reservation.number,
            table_id: reservation.table_id.toString(),
            status: reservation.status,
            capacity: reservation.capacity,
        };
    }
}

export class DeleteReservationCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(reservationModel) {
        const reservation = await reservationModel.findByIdAndDelete(this.id);
        return reservation ? true : false;
    }
}
