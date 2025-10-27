import { validateOrder, validateOrderDish, validateOrderUpdate } from '@/lib/validators/order.validator';
import { ValidationError } from '@/lib/error-handler';

export class CreateOrderCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateOrder(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(orderModel) {
        this.validate();

        const order = await orderModel.create({
            restaurant_id: this.data.restaurant_id,
            number: Number(this.data.number),
            table_id: this.data.table_id,
            items: this.data.items || [],
        });

        return {
            id: order._id.toString(),
            restaurant_id: order.restaurant_id.toString(),
            number: order.number,
            table_id: order.table_id.toString(),
            items: order.items,
        };
    }
}

export class AddDishToOrderCommand {
    constructor(orderId, dishData) {
        this.orderId = orderId;
        this.dishData = dishData;
    }

    validate() {
        const { isValid, errors } = validateOrderDish(this.dishData);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(orderModel) {
        this.validate();

        const order = await orderModel.findById(this.orderId);
        if (!order) {
            return null;
        }

        const dish = {
            name: this.dishData.name.trim(),
            quantity: Number(this.dishData.quantity),
        };

        order.items.push(dish);
        await order.save();

        return {
            id: order._id.toString(),
            restaurant_id: order.restaurant_id.toString(),
            number: order.number,
            table_id: order.table_id.toString(),
            items: order.items,
        };
    }
}

export class UpdateOrderDishCommand {
    constructor(orderId, items) {
        this.orderId = orderId;
        this.items = items;
    }

    validate() {
        const { isValid, errors } = validateOrderUpdate({
            id: this.orderId,
            items: this.items,
        });
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(orderModel) {
        this.validate();

        const order = await orderModel.findByIdAndUpdate(
            this.orderId,
            { items: this.items },
            { new: true, runValidators: true }
        );

        if (!order) {
            return null;
        }

        return {
            id: order._id.toString(),
            restaurant_id: order.restaurant_id.toString(),
            number: order.number,
            table_id: order.table_id.toString(),
            items: order.items,
        };
    }
}

export class DeleteOrderDishCommand {
    constructor(orderId, dishIndex) {
        this.orderId = orderId;
        this.dishIndex = dishIndex;
    }

    async execute(orderModel) {
        const order = await orderModel.findById(this.orderId);
        if (!order) {
            return null;
        }

        order.items.splice(this.dishIndex, 1);
        await order.save();

        return {
            id: order._id.toString(),
            restaurant_id: order.restaurant_id.toString(),
            number: order.number,
            table_id: order.table_id.toString(),
            items: order.items,
        };
    }
}

export class DeleteOrderCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(orderModel) {
        const order = await orderModel.findByIdAndDelete(this.id);
        return order ? true : false;
    }
}
