import { validateMenu, validateDish, validateMenuUpdate } from '@/lib/validators/menu.validator';
import { ValidationError } from '@/lib/error-handler';

export class CreateMenuCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateMenu(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(menuModel) {
        this.validate();

        const menu = await menuModel.create({
            restaurant_id: this.data.restaurant_id,
            number: this.data.number,
            items: this.data.items || [],
        });

        return {
            id: menu._id.toString(),
            restaurant_id: menu.restaurant_id.toString(),
            number: menu.number,
            items: menu.items,
        };
    }
}

export class AddDishToMenuCommand {
    constructor(menuId, dishData) {
        this.menuId = menuId;
        this.dishData = dishData;
    }

    validate() {
        const { isValid, errors } = validateDish(this.dishData);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(menuModel) {
        this.validate();

        const menu = await menuModel.findById(this.menuId);
        if (!menu) {
            return null;
        }

        const dish = {
            name: this.dishData.name.trim(),
            ingredients: this.dishData.ingredients || [],
            price: this.dishData.price,
        };

        menu.items.push(dish);
        await menu.save();

        return {
            id: menu._id.toString(),
            restaurant_id: menu.restaurant_id.toString(),
            number: menu.number,
            items: menu.items,
        };
    }
}

export class UpdateDishCommand {
    constructor(menuId, items) {
        this.menuId = menuId;
        this.items = items;
    }

    validate() {
        const { isValid, errors } = validateMenuUpdate({
            id: this.menuId,
            items: this.items,
        });
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(menuModel) {
        this.validate();

        const menu = await menuModel.findByIdAndUpdate(
            this.menuId,
            { items: this.items },
            { new: true, runValidators: true }
        );

        if (!menu) {
            return null;
        }

        return {
            id: menu._id.toString(),
            restaurant_id: menu.restaurant_id.toString(),
            number: menu.number,
            items: menu.items,
        };
    }
}

export class DeleteDishCommand {
    constructor(menuId, dishIndex) {
        this.menuId = menuId;
        this.dishIndex = dishIndex;
    }

    async execute(menuModel) {
        const menu = await menuModel.findById(this.menuId);
        if (!menu) {
            return null;
        }

        menu.items.splice(this.dishIndex, 1);
        await menu.save();

        return {
            id: menu._id.toString(),
            restaurant_id: menu.restaurant_id.toString(),
            number: menu.number,
            items: menu.items,
        };
    }
}

export class DeleteMenuCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(menuModel) {
        const menu = await menuModel.findByIdAndDelete(this.id);
        return menu ? true : false;
    }
}
