import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, Text, View } from 'react-native';
import type { CategorySlug } from '../../api/potterdb';
import { fetchChapters, fetchOne, getDisplayName } from '../../api/potterdb';
import { FogBackground } from '../../components/FogBackground';
import { HourglassLoader } from '../../components/HourglassLoader';
import { ErrorMirror } from '../../components/ErrorMirror';
import { BurnShell } from '../../components/BurnShell';
import type { DetailNav } from './types';
import { coverImage } from './helpers';
import { detailScreenStyles } from './detailScreenStyles';
import { CharacterDetail } from './CharacterDetail';
import { PotionDetail } from './PotionDetail';
import { SpellDetail } from './SpellDetail';
import { MovieDetail } from './MovieDetail';
import { GenericArchiveDetail } from './GenericArchiveDetail';

export function DetailScreen() {
  const navigation = useNavigation<DetailNav>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { category, id } = route.params as { category: CategorySlug; id: string };
  const [attrs, setAttrs] = useState<Record<string, unknown> | null>(null);
  const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchOne(category, id);
        if (cancelled) return;
        setAttrs(res.data.attributes as Record<string, unknown>);
        if (category === 'books') {
          const ch = await fetchChapters(id, 1);
          if (cancelled) return;
          setChapters(
            ch.data.map((c) => {
              const a = c.attributes as { title?: string };
              return { id: c.id, title: a.title ?? '—' };
            })
          );
        } else {
          setChapters([]);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Sealed.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, id, retryKey]);

  const title = attrs ? getDisplayName(category, attrs) : '…';

  const imageUrl = attrs ? coverImage(category, attrs) : null;
  const wiki = attrs && typeof attrs.wiki === 'string' ? attrs.wiki : null;

  return (
    <FogBackground>
      <BurnShell>
        {err ? (
          <ErrorMirror onRetry={() => setRetryKey((k) => k + 1)} />
        ) : loading ? (
          <View style={detailScreenStyles.loader}>
            <HourglassLoader />
            <Text style={detailScreenStyles.loaderTxt}>Unsealing…</Text>
          </View>
        ) : attrs ? (
          <ScrollView
            contentContainerStyle={[
              detailScreenStyles.scroll,
              { paddingBottom: insets.bottom + 100 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {category === 'characters' ? (
              <CharacterDetail
                attrs={attrs}
                title={title}
                imageUrl={imageUrl}
                id={id}
                wiki={wiki}
                navigation={navigation}
              />
            ) : category === 'potions' ? (
              <PotionDetail
                attrs={attrs}
                title={title}
                imageUrl={imageUrl}
                id={id}
                wiki={wiki}
                navigation={navigation}
              />
            ) : category === 'spells' ? (
              <SpellDetail
                attrs={attrs}
                title={title}
                imageUrl={imageUrl}
                id={id}
                wiki={wiki}
                navigation={navigation}
              />
            ) : category === 'movies' ? (
              <MovieDetail
                attrs={attrs}
                title={title}
                imageUrl={imageUrl}
                id={id}
                wiki={wiki}
              />
            ) : (
              <GenericArchiveDetail
                category={category}
                attrs={attrs}
                title={title}
                imageUrl={imageUrl}
                id={id}
                wiki={wiki}
                chapters={chapters}
                navigation={navigation}
              />
            )}
          </ScrollView>
        ) : null}
      </BurnShell>
    </FogBackground>
  );
}
