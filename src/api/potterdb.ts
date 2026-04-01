const BASE = 'https://api.potterdb.com';

export type ResourceType =
  | 'book'
  | 'character'
  | 'movie'
  | 'potion'
  | 'spell'
  | 'chapter';

export interface JsonApiResource<T = Record<string, unknown>> {
  id: string;
  type: ResourceType | string;
  attributes: T;
}

export interface ListResponse<T = Record<string, unknown>> {
  data: JsonApiResource<T>[];
  meta?: {
    pagination?: {
      current: number;
      next: number | null;
      last: number;
      records: number;
    };
  };
}

export interface SingleResponse<T = Record<string, unknown>> {
  data: JsonApiResource<T>;
}

export type CategorySlug = 'books' | 'characters' | 'movies' | 'potions' | 'spells';

function buildFilterKey(category: CategorySlug): string {
  switch (category) {
    case 'books':
    case 'movies':
      return 'filter[title_cont]';
    default:
      return 'filter[name_cont]';
  }
}

export async function fetchList(
  category: CategorySlug,
  page: number,
  search: string
): Promise<ListResponse> {
  const params = new URLSearchParams();
  params.set('page[size]', '25');
  params.set('page[number]', String(page));
  const q = search.trim();
  if (q) {
    params.set(buildFilterKey(category), q);
  }
  const url = `${BASE}/v1/${category}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`The archive rejected your request (${res.status})`);
  }
  return res.json() as Promise<ListResponse>;
}

export async function fetchOne(
  category: CategorySlug,
  id: string
): Promise<SingleResponse> {
  const url = `${BASE}/v1/${category}/${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`The archive rejected your request (${res.status})`);
  }
  return res.json() as Promise<SingleResponse>;
}

export async function fetchChapters(
  bookId: string,
  page: number
): Promise<ListResponse> {
  const params = new URLSearchParams();
  params.set('page[size]', '100');
  params.set('page[number]', String(page));
  const url = `${BASE}/v1/books/${encodeURIComponent(
    bookId
  )}/chapters?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`The archive rejected your request (${res.status})`);
  }
  return res.json() as Promise<ListResponse>;
}

export async function fetchChapter(
  bookId: string,
  chapterId: string
): Promise<SingleResponse> {
  const url = `${BASE}/v1/books/${encodeURIComponent(
    bookId
  )}/chapters/${encodeURIComponent(chapterId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`The archive rejected your request (${res.status})`);
  }
  return res.json() as Promise<SingleResponse>;
}

export function getDisplayName(
  _category: CategorySlug,
  attrs: Record<string, unknown>
): string {
  const title = attrs.title;
  const name = attrs.name;
  if (typeof title === 'string' && title.length) return title;
  if (typeof name === 'string' && name.length) return name;
  return 'Unknown';
}
