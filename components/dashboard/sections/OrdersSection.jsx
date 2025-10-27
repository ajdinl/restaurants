import { OrderCard } from '../cards/OrderCard';
import DashboardWrapper from '../DashboardWrapper';

export const OrdersSection = ({
    orders,
    tables,
    menu,
    view,
    loading,
    restaurantId,
    onEdit,
    onDelete,
    onDeleteOrder,
    onAddOrder,
    onAddDish,
}) => {
    const orderNumbers = orders?.map((order) => order.number) || [];
    const totalOrders = orders?.length || 0;
    const totalItems = orders?.reduce((acc, order) => acc + (order.items?.length || 0), 0) || 0;

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'orders',
                title: 'Orders',
                description: 'Track and manage current customer orders.',
                buttonText: 'Add Order',
                view,
                loading,
                openNewModal: onAddOrder,
                modalData: {
                    category: 'Order',
                    restaurantId,
                    orderNumbers,
                    tables,
                },
            }}
        >
            {!view && totalOrders > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                        <span className="font-medium text-green-700 dark:text-green-300">
                            {totalOrders} active orders
                        </span>
                    </div>
                    <div className="w-px h-4 bg-green-300 dark:bg-green-700"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span className="font-medium text-green-700 dark:text-green-300">{totalItems} items total</span>
                    </div>
                </div>
            )}
            <ul className="space-y-2">
                {!view
                    ? orders
                          ?.sort((a, b) => a.number - b.number)
                          .slice(0, 5)
                          ?.map((order) => (
                              <OrderCard
                                  key={order.id}
                                  order={order}
                                  menu={menu}
                                  tables={tables}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  onDeleteOrder={onDeleteOrder}
                                  onAddDish={onAddDish}
                                  isExpanded={false}
                              />
                          ))
                    : orders
                          ?.sort((a, b) => a.number - b.number)
                          ?.map((order) => (
                              <OrderCard
                                  key={order.id}
                                  order={order}
                                  menu={menu}
                                  tables={tables}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  onDeleteOrder={onDeleteOrder}
                                  onAddDish={onAddDish}
                                  isExpanded={true}
                              />
                          ))}
            </ul>
        </DashboardWrapper>
    );
};
