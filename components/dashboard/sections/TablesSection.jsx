import { TableCard } from '../cards/TableCard';
import DashboardWrapper from '../DashboardWrapper';

export const TablesSection = ({ tables, view, loading, restaurantId, onEdit, onDelete, onAddTable }) => {
    const totalCapacity = tables?.reduce((acc, table) => acc + (table.capacity || 0), 0) || 0;

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'tables',
                title: 'Tables',
                description: 'Manage seating arrangements and table capacity.',
                buttonText: 'Add Table',
                view,
                loading,
                openNewModal: onAddTable,
                modalData: {
                    category: 'Table',
                    restaurantId,
                    tables,
                },
            }}
        >
            {!view && tables?.length > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                        </svg>
                        <span className="font-medium text-primary-700 dark:text-primary-300">
                            {tables.length} tables
                        </span>
                    </div>
                    <div className="w-px h-4 bg-primary-300 dark:bg-primary-700"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="font-medium text-primary-700 dark:text-primary-300">
                            {totalCapacity} total capacity
                        </span>
                    </div>
                </div>
            )}
            <ul className="space-y-2">
                {!view
                    ? tables
                          ?.sort((a, b) => a.number - b.number)
                          .slice(0, 5)
                          ?.map((table) => (
                              <TableCard
                                  key={table.id}
                                  table={table}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  isExpanded={false}
                              />
                          ))
                    : tables
                          ?.sort((a, b) => a.number - b.number)
                          .map((table) => (
                              <TableCard
                                  key={table.id}
                                  table={table}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  isExpanded={true}
                              />
                          ))}
            </ul>
        </DashboardWrapper>
    );
};
