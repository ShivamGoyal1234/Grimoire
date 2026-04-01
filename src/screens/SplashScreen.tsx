import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';
import { ParticleDust } from '../components/ParticleDust';
import { MagicTap } from '../components/MagicTap';
import { GrimoireSigil } from '../components/GrimoireSigil';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const ink = useSharedValue(0);
  const bleed = useSharedValue(0.02);
  const pulse = useSharedValue(1);
  const bottomFog = useSharedValue(0);

  useEffect(() => {
    ink.value = withTiming(1, { duration: 2400, easing: Easing.out(Easing.cubic) });
    bleed.value = withRepeat(
      withSequence(
        withTiming(0.12, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.02, { duration: 2800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    pulse.value = withRepeat(
      withTiming(1.06, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    bottomFog.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [ink, bleed, pulse, bottomFog]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: ink.value,
    transform: [{ scale: 0.96 + ink.value * 0.04 }],
  }));

  const mistStyle = useAnimatedStyle(() => ({
    opacity: bleed.value * 2.2,
  }));

  const sigilStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowOpacity: 0.35 + (pulse.value - 1) * 3,
  }));

  const bottomFogStyle = useAnimatedStyle(() => ({
    opacity: 0.28 + bottomFog.value * 0.22,
    transform: [{ translateX: -18 + bottomFog.value * 36 }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.splashBlack, '#0d0b16', colors.splashBlack]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(122, 134, 175, 0.12)', 'transparent']}
        style={styles.vortex}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View style={[styles.inkMist, mistStyle]} />
      <Animated.View style={[styles.bottomFogWrap, bottomFogStyle]} pointerEvents="none">
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.2)', 'transparent']}
          locations={[0, 0.25, 0.72, 1]}
          style={[styles.bottomFogBlob, styles.bottomFogOne]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.16)', 'transparent']}
          locations={[0, 0.2, 0.7, 1]}
          style={[styles.bottomFogBlob, styles.bottomFogTwo]}
        />
      </Animated.View>
      <ParticleDust count={40} />

      <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 10 }]}>
        <Animated.Text style={[styles.title, titleStyle]}>The Grimoire</Animated.Text>

        <View style={styles.middle}>
          <MagicTap onPress={() => navigation.replace('Categories')} style={styles.sigilTap}>
            <Animated.View
              style={[
                styles.sigilGlow,
                sigilStyle,
                {
                  shadowColor: colors.sicklyGreen,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 14,
                },
              ]}
            >
              <GrimoireSigil />
            </Animated.View>
          </MagicTap>
          <Text style={styles.quote}>
            Touch the sigil to manifest the archive. Within these pages lie the secrets of the forgotten ages.
          </Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>REGISTRY</Text>
            <Text style={[styles.footerValue, { fontFamily: mono }]}>#00-IX-DARK</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>ATMOSPHERE</Text>
            <Text style={[styles.footerValue, { fontFamily: mono }]}>UNSTABLE</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.splashBlack,
    overflow: 'hidden',
  },
  vortex: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  inkMist: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(136, 146, 184, 0.92)',
    opacity: 0.06,
    alignSelf: 'center',
    top: '26%',
    zIndex: 1,
  },
  title: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 44,
    color: colors.ghostWhite,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.65)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  sigilTap: {
    alignItems: 'center',
  },
  sigilGlow: {
    borderRadius: 100,
    padding: 4,
  },
  quote: {
    marginTop: 28,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.quoteGreenGrey,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  bottomFogWrap: {
    position: 'absolute',
    left: -28,
    right: -28,
    bottom: -12,
    height: 180,
    zIndex: 1,
  },
  bottomFogBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  bottomFogOne: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  bottomFogTwo: {
    left: 22,
    right: 22,
    bottom: 44,
    height: 88,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.labelMuted,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#9b87c6',
  },
});
