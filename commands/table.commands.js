import { validateTable, validateTableUpdate } from '@/lib/validators/table.validator';
import { ValidationError } from '@/lib/error-handler';

export class CreateTableCommand {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateTable(this.data);
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(tableModel) {
        this.validate();

        const table = await tableModel.create({
            restaurant_id: this.data.restaurant_id,
            number: this.data.number,
            capacity: Number(this.data.capacity),
        });

        return {
            id: table._id.toString(),
            restaurant_id: table.restaurant_id.toString(),
            number: table.number,
            capacity: table.capacity,
        };
    }
}

export class UpdateTableCommand {
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }

    validate() {
        const { isValid, errors } = validateTableUpdate({
            id: this.id,
            ...this.data,
        });
        if (!isValid) {
            throw new ValidationError(errors);
        }
        return true;
    }

    async execute(tableModel) {
        this.validate();

        const updateData = {};
        if (this.data.capacity !== undefined) {
            updateData.capacity = Number(this.data.capacity);
        }
        if (this.data.number !== undefined) {
            updateData.number = Number(this.data.number);
        }

        const table = await tableModel.findByIdAndUpdate(this.id, updateData, { new: true, runValidators: true });

        if (!table) {
            return null;
        }

        return {
            id: table._id.toString(),
            restaurant_id: table.restaurant_id.toString(),
            number: table.number,
            capacity: table.capacity,
        };
    }
}

export class DeleteTableCommand {
    constructor(id) {
        this.id = id;
    }

    async execute(tableModel) {
        const table = await tableModel.findByIdAndDelete(this.id);
        return table ? true : false;
    }
}
