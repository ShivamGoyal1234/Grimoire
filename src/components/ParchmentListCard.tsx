import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { MagicTap } from './MagicTap';

export function ParchmentListCard({
  title,
  subtitle,
  sigil,
  index,
  onPress,
  children,
}: {
  title: string;
  subtitle?: string;
  sigil?: string;
  index: number;
  onPress: () => void;
  children?: ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 48, 520)).duration(480)}
    >
      <MagicTap onPress={onPress} style={styles.hit}>
        <LinearGradient colors={['rgba(17,14,22,0.98)', 'rgba(12,10,16,0.96)']} style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.sigil}>{sigil ?? '✦'}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.sub} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Open dossier</Text>
            <Text style={styles.footerArrow}>›</Text>
          </View>
          {children}
        </LinearGradient>
      </MagicTap>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hit: {
    marginBottom: 12,
    marginHorizontal: 4,
  },
  body: {
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.25)',
    paddingVertical: 13,
    paddingHorizontal: 14,
    shadowColor: colors.sicklyGreen,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    minWidth: 34,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.45)',
    backgroundColor: 'rgba(184,154,98,0.12)',
    alignItems: 'center',
  },
  badgeTxt: {
    fontSize: 10,
    color: colors.sicklyGreen,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sigil: {
    fontSize: 14,
    color: colors.sicklyGreen,
    opacity: 0.85,
  },
  title: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 24,
    color: colors.ghostWhite,
    letterSpacing: 0.2,
  },
  sub: {
    marginTop: 4,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 13,
    color: 'rgba(232,232,208,0.64)',
    lineHeight: 19,
  },
  footerRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(184,154,98,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(232,232,208,0.55)',
    fontWeight: '600',
  },
  footerArrow: {
    fontSize: 18,
    color: colors.sicklyGreen,
  },
});
