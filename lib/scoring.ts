import { Dish, DishAllergens, AllergenStatus } from './types';

export const UK_ALLERGENS: { key: keyof DishAllergens; name: string; emoji: string }[] = [
  { key: 'gluten', name: 'Gluten', emoji: '🌾' },
  { key: 'milk', name: 'Milk', emoji: '🥛' },
  { key: 'eggs', name: 'Eggs', emoji: '🥚' },
  { key: 'peanuts', name: 'Peanuts', emoji: '🥜' },
  { key: 'treeNuts', name: 'Tree nuts', emoji: '🌰' },
  { key: 'fish', name: 'Fish', emoji: '🐟' },
  { key: 'crustaceans', name: 'Crustaceans', emoji: '🦐' },
  { key: 'soya', name: 'Soya', emoji: '🫘' },
  { key: 'celery', name: 'Celery', emoji: '🥬' },
  { key: 'mustard', name: 'Mustard', emoji: '🌿' },
  { key: 'sesame', name: 'Sesame', emoji: '⚪' },
  { key: 'sulphites', name: 'Sulphites', emoji: '🍷' },
  { key: 'lupin', name: 'Lupin', emoji: '🌸' },
  { key: 'molluscs', name: 'Molluscs', emoji: '🐚' },
];

export function filterMatchesDish(dish: Dish, activeFilters: string[]): boolean {
  if (activeFilters.length === 0) return true;

  for (const filter of activeFilters) {
    if (filter === 'vegan' && !dish.isVegan) return false;
    if (filter === 'vegetarian' && !dish.isVegetarian) return false;
    if (filter === 'gf' && (dish.allergens.gluten === 'contains' || dish.allergens.gluten === 'traces')) return false;
    if (filter === 'nut-free' && (dish.allergens.peanuts === 'contains' || dish.allergens.treeNuts === 'contains')) return false;
    if (filter === 'dairy-free' && dish.allergens.milk === 'contains') return false;
  }
  return true;
}

export function getCompatibleCount(dishes: Dish[], activeFilters: string[]): number {
  return dishes.filter((d) => filterMatchesDish(d, activeFilters)).length;
}

export function getDishTags(dish: Dish): string[] {
  const tags: string[] = [];
  if (dish.isVegan) tags.push('Vegan');
  if (dish.isVegetarian && !dish.isVegan) tags.push('Vegetarian');
  if (dish.allergens.gluten === 'no') tags.push('GF');
  if (dish.allergens.peanuts === 'no' && dish.allergens.treeNuts === 'no') tags.push('Nut-free');
  if (dish.allergens.milk === 'no') tags.push('Dairy-free');
  return tags;
}

export function getAllergenSummary(allergens: DishAllergens): {
  contains: string[];
  traces: string[];
} {
  const contains: string[] = [];
  const traces: string[] = [];
  for (const { key, name } of UK_ALLERGENS) {
    const status = allergens[key];
    if (status === 'contains') contains.push(name);
    else if (status === 'traces') traces.push(name);
  }
  return { contains, traces };
}

export function rankRestaurants(
  restaurants: { id: number; dishes: Dish[] }[],
  activeFilters: string[]
) {
  return restaurants
    .map((r) => ({
      ...r,
      compatibleCount: getCompatibleCount(r.dishes, activeFilters),
    }))
    .sort((a, b) => b.compatibleCount - a.compatibleCount);
}
