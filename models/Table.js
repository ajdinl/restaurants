import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema(
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
        capacity: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

TableSchema.pre('deleteOne', { document: true, query: false }, async function () {
    await mongoose.model('Order').deleteMany({ table_id: this._id });
    await mongoose.model('Reservation').deleteMany({ table_id: this._id });
});

TableSchema.pre('findOneAndDelete', async function () {
    const tableId = this.getQuery()._id;

    if (tableId) {
        await mongoose.model('Order').deleteMany({ table_id: tableId });
        await mongoose.model('Reservation').deleteMany({ table_id: tableId });
    }
});

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
