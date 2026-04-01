import type { CategorySlug } from '../api/potterdb';

export type RootStackParamList = {
  Splash: undefined;
  Categories: undefined;
  List: { category: CategorySlug };
  Detail: { category: CategorySlug; id: string };
  Chapter: { bookId: string; chapterId: string };
};
