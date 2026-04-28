declare global {
  interface Window {
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

function track(event: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(event, props);
  }
}

export const analytics = {
  waitlistJoined: (filters: string[]) => track('waitlist_joined', { filters }),
  restaurantViewed: (slug: string) => track('restaurant_viewed', { slug }),
  dishViewed: (id: number, restaurantId: number) => track('dish_viewed', { id, restaurant_id: restaurantId }),
  filterChanged: (filters: string[]) => track('filter_changed', { filters }),
  bookTableClicked: (restaurantSlug: string) => track('book_table_clicked', { slug: restaurantSlug }),
  groupMatchStarted: (personCount: number) => track('group_match_started', { person_count: personCount }),
  menuImported: (restaurantId: string) => track('menu_imported', { restaurant_id: restaurantId }),
};
