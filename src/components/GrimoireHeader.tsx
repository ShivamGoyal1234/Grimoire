import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { rootNavigationRef } from '../navigation/rootNavigationRef';
import type { RootStackParamList } from '../navigation/types';

const GREEN = colors.sicklyGreen;

function OpenBookMark({ size = 30 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.95,
        shadowRadius: 8,
      }}
    >
      <Path
        d="M16 5L6 8v18l10-3 10 3V8L16 5z"
        fill="none"
        stroke={GREEN}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path d="M16 5v20" stroke={GREEN} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M10 12h5M10 16h4M22 12h-5M22 16h-4" stroke={GREEN} strokeWidth={1.3} />
    </Svg>
  );
}

export function GrimoireHeader({
  routeName,
}: {
  routeName: keyof RootStackParamList;
}) {
  const insets = useSafeAreaInsets();

  const onBack =
    routeName === 'List'
      ? () => rootNavigationRef.navigate('Categories')
      : routeName === 'Detail' || routeName === 'Chapter'
        ? () => {
            if (rootNavigationRef.isReady()) {
              rootNavigationRef.goBack();
            }
          }
        : null;

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <OpenBookMark />
          <Text style={styles.title}>THE GRIMOIRE</Text>
        </View>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.backHit}>
            <Text style={styles.back}>
              {routeName === 'List'
                ? '‹ Archive'
                : routeName === 'Chapter'
                  ? '‹ Leave scroll'
                  : '‹ Return'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.archiveBlack,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(184,154,98,0.2)',
    zIndex: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  title: {
    fontFamily: 'IMFellEnglish_400Regular_Italic',
    fontSize: 22,
    letterSpacing: 2,
    color: GREEN,
    textTransform: 'uppercase',
    textShadowColor: GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  backHit: {
    paddingVertical: 4,
    paddingLeft: 12,
  },
  back: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 16,
    color: GREEN,
    opacity: 0.92,
  },
});
