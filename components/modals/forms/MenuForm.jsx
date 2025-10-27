import { Button } from '@/components';

export const MenuForm = ({ onSave }) => {
    return (
        <form className="space-y-4">
            <Button
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500"
                onClick={onSave}
            >
                Add
            </Button>
        </form>
    );
};
