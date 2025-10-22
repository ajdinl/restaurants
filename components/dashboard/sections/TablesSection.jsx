import { TableCard } from '../cards/TableCard';
import DashboardWrapper from '../DashboardWrapper';

export const TablesSection = ({ tables, view, loading, restaurantId, onEdit, onDelete, onAddTable }) => {
    return (
        <DashboardWrapper
            wrapperData={{
                type: 'tables',
                title: 'Tables',
                description: 'List of tables.',
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
