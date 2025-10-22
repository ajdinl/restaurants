import mongoose from 'mongoose'

const MenuSchema = new mongoose.Schema(
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
    items: [
      {
        name: String,
        ingredients: [String],
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema)


