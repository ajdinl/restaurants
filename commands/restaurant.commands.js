import { validateRestaurant, validateRestaurantUpdate } from '@/lib/validators/restaurant.validator';
import { ValidationError } from '@/lib/error-handler';

export class CreateRestaurantCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateRestaurant(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(restaurantModel) {
        this.validate();

        const restaurant = await restaurantModel.create({
            name: this.data.name.trim(),
            address: this.data.address.trim(),
            phone: this.data.phone.trim(),
            user_id: this.data.user_id,
        });

        return {
            id: restaurant._id.toString(),
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            user_id: restaurant.user_id.toString(),
        };
    }
}

export class UpdateRestaurantCommand {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateRestaurantUpdate(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(restaurantModel) {
        this.validate();

        const updateData = {};
        if (this.data.name !== undefined) updateData.name = this.data.name.trim();
        if (this.data.address !== undefined) updateData.address = this.data.address.trim();
        if (this.data.phone !== undefined) updateData.phone = this.data.phone.trim();

        const restaurant = await restaurantModel.findByIdAndUpdate(this.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!restaurant) {
            return null;
        }

        return {
            id: restaurant._id.toString(),
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            user_id: restaurant.user_id.toString(),
        };
    }
}

export class DeleteRestaurantCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(restaurantModel) {
        const restaurant = await restaurantModel.findByIdAndDelete(this.id);
        return restaurant ? true : false;
    }
}
