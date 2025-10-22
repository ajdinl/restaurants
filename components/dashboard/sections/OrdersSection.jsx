import { OrderCard } from '../cards/OrderCard';
import DashboardWrapper from '../DashboardWrapper';

export const OrdersSection = ({
    orders,
    tables,
    view,
    loading,
    restaurantId,
    onEdit,
    onDelete,
    onAddOrder,
    onAddDish,
}) => {
    const orderNumbers = orders?.map((order) => order.number) || [];

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'orders',
                title: 'Orders',
                description: 'List of current orders.',
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
            <ul className={`${view ? 'space-y-4' : 'space-y-2'}`}>
                {!view
                    ? orders
                          ?.sort((a, b) => a.number - b.number)
                          .slice(0, 5)
                          ?.map((order) => (
                              <OrderCard
                                  key={order.id}
                                  order={order}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
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
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  onAddDish={onAddDish}
                                  isExpanded={true}
                              />
                          ))}
            </ul>
        </DashboardWrapper>
    );
};
