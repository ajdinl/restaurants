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

    async checkConflict(reservationModel) {
        const reservationDate = new Date(this.data.date);
        const startOfDay = new Date(reservationDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(reservationDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingReservation = await reservationModel.findOne({
            table_id: this.data.table_id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            time: this.data.time,
        });

        if (existingReservation) {
            throw new ValidationError({
                table_id: 'This table is already reserved at the selected date and time',
            });
        }
    }

    async execute(reservationModel) {
        this.validate();
        await this.checkConflict(reservationModel);

        const reservation = await reservationModel.create({
            restaurant_id: this.data.restaurant_id,
            number: Number(this.data.number),
            table_id: this.data.table_id,
            status: this.data.status,
            capacity: Number(this.data.capacity),
            date: new Date(this.data.date),
            time: this.data.time,
        });

        return {
            id: reservation._id.toString(),
            restaurant_id: reservation.restaurant_id.toString(),
            number: reservation.number,
            table_id: reservation.table_id.toString(),
            status: reservation.status,
            capacity: reservation.capacity,
            date: reservation.date ? reservation.date.toISOString().split('T')[0] : this.data.date,
            time: reservation.time || this.data.time,
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

    async checkConflict(reservationModel) {
        if (this.data.table_id !== undefined || this.data.date !== undefined || this.data.time !== undefined) {
            const currentReservation = await reservationModel.findById(this.id);
            if (!currentReservation) {
                return;
            }

            const tableId = this.data.table_id || currentReservation.table_id;
            const date = this.data.date || currentReservation.date;
            const time = this.data.time || currentReservation.time;

            const reservationDate = new Date(date);
            const startOfDay = new Date(reservationDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(reservationDate);
            endOfDay.setHours(23, 59, 59, 999);

            const existingReservation = await reservationModel.findOne({
                _id: { $ne: this.id },
                table_id: tableId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
                time: time,
            });

            if (existingReservation) {
                throw new ValidationError({
                    table_id: 'This table is already reserved at the selected date and time',
                });
            }
        }
    }

    async execute(reservationModel) {
        this.validate();
        await this.checkConflict(reservationModel);

        const updateData = {};
        if (this.data.status !== undefined) updateData.status = this.data.status;
        if (this.data.capacity !== undefined) updateData.capacity = Number(this.data.capacity);
        if (this.data.table_id !== undefined) updateData.table_id = this.data.table_id;
        if (this.data.date !== undefined) updateData.date = new Date(this.data.date);
        if (this.data.time !== undefined) updateData.time = this.data.time;

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
            date: reservation.date ? reservation.date.toISOString().split('T')[0] : null,
            time: reservation.time || null,
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
