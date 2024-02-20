import RestaurantComponent from '@/components/Restaurant'
export default function Restaurant({ params }) {
  return <RestaurantComponent id={params.id} />
}
