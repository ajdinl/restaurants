import { useState } from 'react';
import { Button } from '@/components';

export const OrderForm = ({ tables = [], restaurants = [], isAdmin = false, error, onSave }) => {
    const [tableNumber, setTableNumber] = useState('');

    return (
        <form className="flex flex-col space-y-4">
            {isAdmin && (
                <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value=""></option>
                    {restaurants?.map((restaurant) =>
                        restaurant.tables.map((table) => (
                            <option key={table.id} value={table.number}>
                                Table #{table.number}
                            </option>
                        ))
                    )}
                </select>
            )}
            {!isAdmin && (
                <select
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                >
                    <option value=""></option>
                    {tables?.map((table) => (
                        <option key={table.id} value={table.number}>
                            Table #{table.number}
                        </option>
                    ))}
                </select>
            )}
            <span className="text-red-500 text-sm">{error}</span>
            <Button
                className="w-20 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => onSave(tableNumber)}
            >
                Add
            </Button>
        </form>
    );
};
