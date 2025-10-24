import { useEffect, useCallback } from 'react';
import { handleDeleteItem } from '@/services/data.service';

export default function DeleteModal({ setShowDeleteModal, selected, getRestaurantsData }) {
    const confirmDelete = useCallback(() => {
        handleDeleteItem(selected.category, selected.data, selected.index, () => {
            getRestaurantsData();
            setShowDeleteModal(false);
        });
    }, [selected, getRestaurantsData, setShowDeleteModal]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                confirmDelete();
            } else if (event.key === 'Escape') {
                setShowDeleteModal(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [confirmDelete, setShowDeleteModal]);

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4"
                onClick={() => setShowDeleteModal(false)}
            >
                <div className="relative w-full max-w-md my-6 mx-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-medium relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-red-600 dark:text-red-300"
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
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                                    Confirm Deletion
                                </h3>
                            </div>
                            <button
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="relative p-6">
                            <p className="text-neutral-700 dark:text-neutral-300 text-base">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                className="px-4 py-2 rounded-lg font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                type="button"
                                onClick={() => confirmDelete()}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
