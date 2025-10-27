export const DishForm = ({ formData, onChange, error }) => {
    return (
        <form className="space-y-4">
            <label className="block">
                <span className="text-neutral-700 dark:text-neutral-300">Name</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.name && error}</span>
                <input
                    type="text"
                    onChange={(e) => onChange({ ...formData, name: e.target.value })}
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </label>
            <label className="block">
                <span className="text-neutral-700 dark:text-neutral-300">Ingredients</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.ingredients && error}</span>
                <input
                    type="text"
                    onChange={(e) => onChange({ ...formData, ingredients: [e.target.value] })}
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </label>
            <label className="block">
                <span className="text-neutral-700 dark:text-neutral-300">Price</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.price && error}</span>
                <input
                    type="number"
                    onChange={(e) => onChange({ ...formData, price: e.target.value })}
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </label>
        </form>
    );
};
