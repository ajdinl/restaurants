import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
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
    table_number: {
      type: Number,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)


