import { Button } from '@/components';
import { MenuItemCard } from '../cards/MenuItemCard';
import DashboardWrapper from '../DashboardWrapper';

export const MenuSection = ({ menu, view, loading, restaurantId, onEdit, onDelete, onAddMenu, onAddDish }) => {
    const menuNumber = menu?.map((m) => m.number).pop() + 1 || 1;

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'menu',
                title: 'Menu',
                description: 'List of available dishes and beverages.',
                buttonText: 'Add Menu',
                view,
                loading,
                openNewModal: onAddMenu,
                modalData: {
                    category: 'Menu',
                    restaurantId,
                    menuNumber,
                },
            }}
        >
            <ul className="space-y-6">
                {menu
                    ?.sort((a, b) => a.number - b.number)
                    .map((menuItem) => (
                        <li key={menuItem.id} className={`flex flex-col ${view ? 'space-y-4' : 'space-y-2'}`}>
                            <div className="flex flex-row">
                                {view && (
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white absolute top-24 right-8 sm:top-28 sm:mt-2 sm:right-14 text-base"
                                        onClick={() => onAddDish({ category: 'Dish', menu: menuItem })}
                                    >
                                        Add Dish
                                    </Button>
                                )}
                            </div>
                            {!view
                                ? menuItem.items
                                      ?.slice(0, 5)
                                      ?.map((item, index) => (
                                          <MenuItemCard
                                              key={index}
                                              item={item}
                                              index={index}
                                              menu={menuItem}
                                              onEdit={onEdit}
                                              onDelete={onDelete}
                                              isExpanded={false}
                                          />
                                      ))
                                : menuItem.items?.map((item, index) => (
                                      <MenuItemCard
                                          key={index}
                                          item={item}
                                          index={index}
                                          menu={menuItem}
                                          onEdit={onEdit}
                                          onDelete={onDelete}
                                          isExpanded={true}
                                      />
                                  ))}
                        </li>
                    ))}
            </ul>
        </DashboardWrapper>
    );
};
