export const OrderDishForm = ({ formData, onChange, menu = [], error }) => {
    const hasMenuItems = menu && menu.length > 0 && menu.some((m) => m.items?.length > 0);

    if (!hasMenuItems) {
        return (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
                <svg
                    className="w-10 h-10 text-orange-600 dark:text-orange-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">No menu items available</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Please add dishes to the menu first</p>
            </div>
        );
    }

    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Select Dish from Menu
                </label>
                {!formData.name && error && (
                    <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </span>
                )}
                <div className="relative">
                    <select
                        value={formData.name || ''}
                        onChange={(e) => {
                            onChange({
                                name: e.target.value,
                                quantity: formData.quantity || '',
                            });
                        }}
                        className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                    >
                        <option value="">Select a dish</option>
                        {menu
                            ?.flatMap((m) => m.items)
                            .map((item, index) => (
                                <option key={index} value={item.name}>
                                    {item.name} - ${item.price}
                                </option>
                            ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            <label className="block">
                <span className="text-neutral-700 dark:text-neutral-300">Quantity</span>
                {!formData.quantity && error && (
                    <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </span>
                )}
                <input
                    type="number"
                    min="1"
                    value={formData.quantity || ''}
                    onChange={(e) => onChange({ ...formData, quantity: e.target.value })}
                    className="mt-1 block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </label>
        </form>
    );
};
