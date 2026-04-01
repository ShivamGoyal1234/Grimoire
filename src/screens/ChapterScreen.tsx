import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchChapter } from '../api/potterdb';
import { FogBackground } from '../components/FogBackground';
import { HourglassLoader } from '../components/HourglassLoader';
import { ErrorMirror } from '../components/ErrorMirror';
import { BurnShell } from '../components/BurnShell';

export function ChapterScreen() {
  const route = useRoute();
  const { bookId, chapterId } = route.params as { bookId: string; chapterId: string };
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [order, setOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchChapter(bookId, chapterId);
        if (cancelled) return;
        const a = res.data.attributes as {
          title?: string;
          summary?: string;
          order?: number;
        };
        setTitle(a.title ?? '—');
        setSummary(a.summary ?? '');
        setOrder(typeof a.order === 'number' ? a.order : null);
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Torn away.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookId, chapterId, retryKey]);

  return (
    <FogBackground>
      <BurnShell>
        {err ? (
          <ErrorMirror onRetry={() => setRetryKey((k) => k + 1)} />
        ) : loading ? (
          <View style={styles.loader}>
            <HourglassLoader />
            <Text style={styles.loaderTxt}>Unfurling…</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <LinearGradient
              colors={['#2a1810', '#1a0f00', '#120a00']}
              style={styles.parchment}
            >
              <View style={styles.grain} />
              {order != null ? (
                <Text style={styles.order}>Mark {order}</Text>
              ) : null}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.body}>{summary}</Text>
            </LinearGradient>
            <View style={{ height: 200 }} />
          </ScrollView>
        )}
      </BurnShell>
    </FogBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },
  loader: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  loaderTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.55)',
  },
  parchment: {
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(139,37,0,0.55)',
    minHeight: 320,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,232,208,0.04)',
    opacity: 0.35,
  },
  order: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 13,
    color: 'rgba(139,37,0,0.85)',
    marginBottom: 8,
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 26,
    color: '#c9a66b',
    marginBottom: 18,
    lineHeight: 32,
  },
  body: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 17,
    lineHeight: 28,
    color: '#4a3020',
  },
});
