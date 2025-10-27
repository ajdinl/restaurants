import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
    {
        restaurant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        table_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
