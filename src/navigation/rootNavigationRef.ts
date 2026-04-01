import { createNavigationContainerRef } from '@react-navigation/native';
import type { CategorySlug } from '../api/potterdb';
import type { RootStackParamList } from './types';

export const rootNavigationRef = createNavigationContainerRef<RootStackParamList>();

export type ArchiveTabBarState = {
  show: boolean;
  activeTab: CategorySlug | null;
  /** Current stack route; set whenever `show` is true (for chrome outside screens). */
  routeName: keyof RootStackParamList | null;
};

export function getArchiveTabBarState(): ArchiveTabBarState {
  const route = rootNavigationRef.getCurrentRoute();
  if (!route) return { show: false, activeTab: null, routeName: null };
  const name = route.name as keyof RootStackParamList;
  switch (route.name) {
    case 'Splash':
      return { show: false, activeTab: null, routeName: name };
    case 'Categories':
      return { show: true, activeTab: null, routeName: name };
    case 'List':
      return { show: true, activeTab: route.params.category, routeName: name };
    case 'Detail':
      return { show: true, activeTab: route.params.category, routeName: name };
    case 'Chapter':
      return { show: true, activeTab: 'books', routeName: name };
    default:
      return { show: false, activeTab: null, routeName: name };
  }
}
