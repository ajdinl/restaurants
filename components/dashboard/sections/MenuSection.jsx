import { Button } from '@/components';
import { MenuItemCard } from '../cards/MenuItemCard';
import DashboardWrapper from '../DashboardWrapper';

export const MenuSection = ({ menu, view, loading, restaurantId, onEdit, onDelete, onAddMenu, onAddDish }) => {
    const menuNumber = menu?.map((m) => m.number).pop() + 1 || 1;
    const totalItems = menu?.reduce((acc, m) => acc + (m.items?.length || 0), 0) || 0;

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
            {!view && totalItems > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-orange-600 dark:text-orange-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <span className="font-medium text-orange-700 dark:text-orange-300">
                            {totalItems} total dishes
                        </span>
                    </div>
                </div>
            )}
            <div className="space-y-6">
                {menu
                    ?.sort((a, b) => a.number - b.number)
                    .map((menuItem) => (
                        <div key={menuItem.id} className={`${view ? 'space-y-4' : 'space-y-2'}`}>
                            {view && (
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                                Menu #{menuItem.number}
                                            </h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {menuItem.items?.length || 0} dishes
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-md focus:ring-orange-500 transition-all"
                                        onClick={() => onAddDish({ category: 'Dish', menu: menuItem })}
                                    >
                                        <svg
                                            className="w-4 h-4 mr-1.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Add Dish
                                    </Button>
                                </div>
                            )}
                            <div className={`grid gap-2 ${view ? 'grid-cols-1' : ''}`}>
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
                            </div>
                        </div>
                    ))}
            </div>
        </DashboardWrapper>
    );
};
