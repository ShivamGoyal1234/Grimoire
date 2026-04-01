import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  CategorySlug,
  fetchList,
  getDisplayName,
  JsonApiResource,
} from '../api/potterdb';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';
import { FogBackground } from '../components/FogBackground';
import { ParchmentListCard } from '../components/ParchmentListCard';
import { HourglassLoader } from '../components/HourglassLoader';
import { ErrorMirror } from '../components/ErrorMirror';
import { ShimmerParchment } from '../components/ShimmerParchment';
import { BurnShell } from '../components/BurnShell';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LABEL: Record<CategorySlug, string> = {
  books: 'Books',
  characters: 'Characters',
  movies: 'Movies',
  potions: 'Potions',
  spells: 'Spells',
};

const SIGIL: Record<CategorySlug, string> = {
  books: '📚',
  characters: '🧙',
  movies: '🎬',
  potions: '🧪',
  spells: '✨',
};

function subtitleFor(category: CategorySlug, attrs: Record<string, unknown>): string | undefined {
  if (category === 'characters' && typeof attrs.house === 'string') {
    return attrs.house;
  }
  if (category === 'spells' && typeof attrs.category === 'string') {
    return attrs.category;
  }
  if (category === 'movies' && typeof attrs.release_date === 'string') {
    return attrs.release_date;
  }
  if (category === 'potions' && typeof attrs.difficulty === 'string') {
    return attrs.difficulty;
  }
  if (category === 'books' && typeof attrs.release_date === 'string') {
    return attrs.release_date;
  }
  return undefined;
}

export function ListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const { category } = route.params as { category: CategorySlug };
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<JsonApiResource[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useLayoutEffect(() => {
    setPage(1);
  }, [category, debounced]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetchList(category, page, debounced);
        if (cancelled) return;
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setHasMore(!!res.meta?.pagination?.next);
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'The archive sealed itself.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, page, debounced, retryToken]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && items.length > 0) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore, items.length]);

  const retry = useCallback(() => {
    setErr(null);
    setPage(1);
    setRetryToken((t) => t + 1);
  }, []);

  return (
    <FogBackground>
      <BurnShell>
        <Animated.View entering={FadeIn.duration(400)} style={styles.headBlock}>
          <Text style={styles.title}>{LABEL[category]}</Text>
          <Text style={styles.quillLabel}>Whisper a name into the quill</Text>
          <View style={styles.quillRow}>
            <Text style={styles.quillIcon}>🪶</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search…"
              placeholderTextColor="rgba(232,232,208,0.35)"
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        {err ? (
          <ErrorMirror onRetry={retry} />
        ) : loading && page === 1 ? (
          <View style={styles.loader}>
            <HourglassLoader />
            <Text style={styles.loaderTxt}>Sifting ashes…</Text>
            <ShimmerParchment height={72} />
            <ShimmerParchment height={72} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            contentContainerStyle={styles.list}
            onEndReached={loadMore}
            onEndReachedThreshold={0.35}
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator color={colors.sicklyGreen} style={{ marginVertical: 16 }} />
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.empty}>Nothing crawled out of the dark. Try another whisper.</Text>
            }
            renderItem={({ item, index }) => {
              const attrs = item.attributes as Record<string, unknown>;
              const title = getDisplayName(category, attrs);
              const sub = subtitleFor(category, attrs);
              return (
                <ParchmentListCard
                  title={title}
                  subtitle={sub}
                  sigil={SIGIL[category]}
                  index={index}
                  onPress={() =>
                    navigation.navigate('Detail', { category, id: item.id })
                  }
                />
              );
            }}
          />
        )}
      </BurnShell>
    </FogBackground>
  );
}

const styles = StyleSheet.create({
  headBlock: {
    paddingHorizontal: 18,
    paddingTop: 8,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 34,
    color: colors.ghostWhite,
  },
  quillLabel: {
    marginTop: 4,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 13,
    letterSpacing: 0.4,
    color: 'rgba(232,232,208,0.62)',
  },
  quillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,37,0,0.65)',
    paddingBottom: 6,
  },
  quillIcon: {
    fontSize: 18,
    marginRight: 8,
    opacity: 0.85,
  },
  input: {
    flex: 1,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 18,
    color: colors.ghostWhite,
    paddingVertical: 6,
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 200,
  },
  loader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 22,
    gap: 12,
  },
  loaderTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.55)',
    marginBottom: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.45)',
    fontSize: 15,
    lineHeight: 22,
  },
});
