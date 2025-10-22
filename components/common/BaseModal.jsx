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
            <div className="fixed inset-0 z-40 bg-black opacity-80" onClick={onClose}></div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-1/4 min-w-96 my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 dark:shadow-md dark:shadow-gray-500/50 outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 dark:border-gray-700 rounded-t">
                            <h3 className="text-3xl font-semibold dark:text-white">{title}</h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={onClose}
                            >
                                X
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto">{children}</div>
                        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 dark:border-gray-700 rounded-b">
                            <Button
                                className="text-red-500 background-transparent font-bold uppercase px-6 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            {showSaveButton && (
                                <Button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
