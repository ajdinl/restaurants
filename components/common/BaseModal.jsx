import { Button } from '@/components';

export const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    saveButtonText = 'Save',
    showSaveButton = true,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4">
                <div className="relative w-full max-w-2xl my-6 mx-auto">
                    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-medium relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
                            <button
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
                                onClick={onClose}
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
                        <div className="relative p-6 flex-auto">{children}</div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Button
                                className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 focus:ring-neutral-500"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            {showSaveButton && (
                                <Button
                                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500"
                                    type="button"
                                    onClick={onSave}
                                >
                                    {saveButtonText}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
