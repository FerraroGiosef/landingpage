export type AllergenStatus = 'no' | 'traces' | 'contains';

export type DietFilter = 'vegan' | 'vegetarian' | 'gf' | 'nut-free' | 'dairy-free';

export type DishMatchStatus = 'compatible' | 'review' | 'incompatible';

export interface Allergen {
  name: string;
  emoji: string;
  key: string;
}

export interface DishAllergens {
  gluten: AllergenStatus;
  milk: AllergenStatus;
  eggs: AllergenStatus;
  peanuts: AllergenStatus;
  treeNuts: AllergenStatus;
  fish: AllergenStatus;
  crustaceans: AllergenStatus;
  soya: AllergenStatus;
  celery: AllergenStatus;
  mustard: AllergenStatus;
  sesame: AllergenStatus;
  sulphites: AllergenStatus;
  lupin: AllergenStatus;
  molluscs: AllergenStatus;
}

export interface DishModification {
  name: string;
  description?: string;
  removes: string[];
  adds: string[];
  priceExtra: number;
}

export interface Dish {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: string;
  kcal?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category: 'starter' | 'main' | 'dessert' | 'side' | 'drink';
  image?: string;
  allergens: DishAllergens;
  isVegan: boolean;
  isVegetarian: boolean;
  modifications?: DishModification[];
}

export interface Restaurant {
  id: number;
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  address: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  heroImage: string;
  dishCount: number;
  lastUpdated: string;
  phone?: string;
  bookingUrl?: string;
}

export interface GroupProfile {
  id: string;
  name: string;
  filters: string[];
}

export interface WaitlistEntry {
  email: string;
  consent_given: boolean;
}

export interface AdminRestaurant {
  id: string;
  name: string;
  email: string;
  cuisine: string;
  address: string;
  phone?: string;
  bookingUrl?: string;
  lastVerified?: string;
}
