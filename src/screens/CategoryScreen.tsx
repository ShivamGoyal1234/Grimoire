import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CategorySlug } from '../api/potterdb';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';
import {
  ArchiveBooksIcon,
  ArchiveCategoryIcon,
} from '../components/ArchiveCategoryIcons';
import { MagicTap } from '../components/MagicTap';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
const PAD = 16;
const GAP = 12;
const GRID_CELL_W = (SCREEN_W - PAD * 2 - GAP) / 2;

function JaggedFooter() {
  return (
    <View style={styles.jaggedWrap} pointerEvents="none">
      <Svg
        width="100%"
        height={32}
        viewBox="0 0 320 32"
        preserveAspectRatio="none"
        style={styles.jaggedSvg}
      >
        <Polyline
          fill="rgba(184,154,98,0.09)"
          stroke="rgba(184,154,98,0.25)"
          strokeWidth="1"
          points="0,32 32,12 64,22 96,8 128,18 160,6 192,20 224,10 256,24 288,14 320,20 320,32 0,32"
        />
      </Svg>
    </View>
  );
}

const GRID: {
  category: CategorySlug;
  title: string;
  subtitle: string;
}[] = [
  { category: 'characters', title: 'Characters', subtitle: 'SOUL RECORDS' },
  { category: 'movies', title: 'Movies', subtitle: 'VISUAL ECHOES' },
  { category: 'potions', title: 'Potions', subtitle: 'ALCHEMICAL MIX' },
  { category: 'spells', title: 'Spells', subtitle: 'INCANTATIONS' },
];

export function CategoryScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const bottomPad = useMemo(() => 88 + Math.max(insets.bottom, 8), [insets.bottom]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['rgba(196,60,0,0.35)', 'rgba(0,0,0,0)', 'transparent']}
        locations={[0, 0.35, 1]}
        style={styles.topGlow}
        pointerEvents="none"
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 16, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleWrap}>
          <Text style={styles.mainTitle}>Forbidden Archives</Text>
          <Text style={styles.instruction}>SELECT A PATH OF KNOWLEDGE</Text>
        </View>

        <Animated.View entering={FadeIn.delay(80)}>
          <MagicTap
            onPress={() => navigation.navigate('List', { category: 'books' })}
            style={styles.featuredOuter}
          >
            <LinearGradient
              colors={['#101010', '#0a0a0a', '#050505']}
              style={styles.cardInner}
            >
              <JaggedFooter />
              <View style={styles.featuredRow}>
                <View style={styles.featuredTextCol}>
                  <Text style={styles.cardTitle}>Books</Text>
                  <Text style={styles.cardMeta}>342 CODICES BOUND</Text>
                </View>
                <ArchiveBooksIcon size={52} />
              </View>
            </LinearGradient>
          </MagicTap>
        </Animated.View>

        <View style={styles.grid}>
          {GRID.map((g, i) => (
            <Animated.View
              key={g.category}
              entering={FadeIn.delay(120 + i * 50)}
              style={{ width: GRID_CELL_W }}
            >
              <MagicTap
                onPress={() => navigation.navigate('List', { category: g.category })}
                style={styles.gridCardOuter}
              >
                <LinearGradient
                  colors={['#101010', '#0a0a0a', '#050505']}
                  style={styles.gridCardInner}
                >
                  <JaggedFooter />
                  <View style={styles.gridIconWrap}>
                    <ArchiveCategoryIcon kind={g.category} size={44} />
                  </View>
                  <Text style={styles.gridTitle}>{g.title}</Text>
                  <Text style={styles.gridMeta}>{g.subtitle}</Text>
                </LinearGradient>
              </MagicTap>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.archiveBlack,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  scroll: {
    paddingHorizontal: PAD,
  },
  titleWrap: {
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  mainTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 28,
    color: colors.ghostWhite,
    textAlign: 'center',
    marginBottom: GAP,
    letterSpacing: 0.5,
  },
  instruction: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.labelMuted,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  featuredOuter: {
    borderWidth: 1,
    borderColor: colors.archiveBorder,
    marginBottom: GAP,
  },
  cardInner: {
    minHeight: 118,
    paddingHorizontal: 18,
    paddingVertical: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  featuredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 26,
    color: colors.ghostWhite,
  },
  cardMeta: {
    marginTop: 8,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.labelMuted,
    fontWeight: '600',
  },
  jaggedWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  jaggedSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  gridCardOuter: {
    borderWidth: 1,
    borderColor: colors.archiveBorder,
    marginBottom: 0,
  },
  gridCardInner: {
    minHeight: 148,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  gridIconWrap: {
    marginBottom: 10,
  },
  gridTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 17,
    color: colors.ghostWhite,
    textAlign: 'center',
  },
  gridMeta: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.labelMuted,
    fontWeight: '600',
  },
});
