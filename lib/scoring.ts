import { Dish, DishAllergens } from './types';

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

export function filterMatchesDish(
  dish: Dish,
  activeFilters: string[]
): { compatible: boolean; traceWarnings: string[] } {
  if (activeFilters.length === 0) return { compatible: true, traceWarnings: [] };

  const traceWarnings: string[] = [];
  const allergenKeys = Object.keys(dish.allergens) as (keyof DishAllergens)[];

  for (const filter of activeFilters) {
    // Dietary preference filters
    if (filter === 'vegan') {
      if (!dish.isVegan) return { compatible: false, traceWarnings: [] };
      continue;
    }
    if (filter === 'vegetarian') {
      if (!dish.isVegetarian) return { compatible: false, traceWarnings: [] };
      continue;
    }

    // Compound dietary filters (these check multiple allergens)
    if (filter === 'gf') {
      if (dish.allergens.gluten === 'contains' || dish.allergens.gluten === 'traces') {
        return { compatible: false, traceWarnings: [] };
      }
      continue;
    }
    if (filter === 'nut-free') {
      if (dish.allergens.peanuts === 'contains' || dish.allergens.treeNuts === 'contains') {
        return { compatible: false, traceWarnings: [] };
      }
      if (dish.allergens.peanuts === 'traces') traceWarnings.push('Peanuts');
      if (dish.allergens.treeNuts === 'traces') traceWarnings.push('Tree nuts');
      continue;
    }
    if (filter === 'dairy-free') {
      if (dish.allergens.milk === 'contains') {
        return { compatible: false, traceWarnings: [] };
      }
      if (dish.allergens.milk === 'traces') traceWarnings.push('Milk');
      continue;
    }

    // Individual allergen filters (gluten, milk, eggs, peanuts, treeNuts, fish, etc.)
    if (allergenKeys.includes(filter as keyof DishAllergens)) {
      const status = dish.allergens[filter as keyof DishAllergens];
      if (status === 'contains') {
        return { compatible: false, traceWarnings: [] };
      }
      if (status === 'traces') {
        const allergenName = UK_ALLERGENS.find((a) => a.key === filter)?.name || filter;
        traceWarnings.push(allergenName);
      }
    }
  }

  return { compatible: true, traceWarnings };
}

export function getCompatibleCount(dishes: Dish[], activeFilters: string[]): number {
  return dishes.filter((d) => filterMatchesDish(d, activeFilters).compatible).length;
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
