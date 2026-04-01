import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { ParticleDust } from './ParticleDust';

const { width, height } = Dimensions.get('window');

export function FogBackground({ children }: { children?: React.ReactNode }) {
  const drift = useSharedValue(0);
  const pulse = useSharedValue(0.4);
  const dementorDrift = useSharedValue(0);
  const dementorFloat = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    pulse.value = withRepeat(
      withTiming(0.85, { duration: 9000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    dementorDrift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    dementorFloat.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 5200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [drift, pulse, dementorDrift, dementorFloat]);

  const fogStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (drift.value - 0.5) * 40 }, { translateY: (drift.value - 0.5) * 28 }],
    opacity: pulse.value,
  }));

  const dementorOneStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + dementorFloat.value * 0.28,
    transform: [
      { translateX: 26 - dementorDrift.value * 64 },
      { translateY: -10 + dementorFloat.value * 18 },
      { scale: 0.95 + dementorFloat.value * 0.14 },
    ],
  }));

  const dementorTwoStyle = useAnimatedStyle(() => ({
    opacity: 0.14 + (1 - dementorFloat.value) * 0.24,
    transform: [
      { translateX: -18 + dementorDrift.value * 52 },
      { translateY: 8 - dementorFloat.value * 16 },
      { scale: 0.9 + (1 - dementorFloat.value) * 0.12 },
    ],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.voidBlack, colors.bloodParchment, colors.voidBlack]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <Animated.View style={[styles.fogLayer, fogStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(164, 173, 198, 0.18)', 'transparent', 'rgba(58, 48, 80, 0.2)']}
          locations={[0, 0.35, 0.62, 1]}
          style={[styles.fogBlob, { left: -width * 0.2, top: height * 0.1 }]}
        />
        <LinearGradient
          colors={['rgba(8,8,8,0.2)', 'rgba(28, 26, 42, 0.62)', 'transparent']}
          style={[styles.fogBlob, { right: -width * 0.25, bottom: height * 0.05 }]}
        />
      </Animated.View>
      <View pointerEvents="none" style={styles.dementorLayer}>
        <Animated.View style={[styles.dementor, styles.dementorOne, dementorOneStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(15, 14, 24, 0.62)', 'rgba(8,7,12,0.0)']}
            locations={[0, 0.38, 1]}
            style={styles.dementorGlow}
          />
        </Animated.View>
        <Animated.View style={[styles.dementor, styles.dementorTwo, dementorTwoStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(17, 15, 28, 0.58)', 'rgba(8,7,12,0.0)']}
            locations={[0, 0.35, 1]}
            style={styles.dementorGlow}
          />
        </Animated.View>
      </View>
      <ParticleDust count={48} />
      <View style={{ flex: 1, zIndex: 2 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.voidBlack,
    overflow: 'hidden',
  },
  fogLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  fogBlob: {
    position: 'absolute',
    width: width * 1.2,
    height: height * 0.55,
    borderRadius: 200,
    opacity: 0.9,
  },
  dementorLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  dementor: {
    position: 'absolute',
    backgroundColor: 'rgba(8, 7, 12, 0.4)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  dementorOne: {
    width: 180,
    height: 220,
    top: height * 0.17,
    right: -20,
    transform: [{ rotate: '-8deg' }],
  },
  dementorTwo: {
    width: 140,
    height: 185,
    top: height * 0.52,
    left: -28,
    transform: [{ rotate: '7deg' }],
  },
  dementorGlow: {
    ...StyleSheet.absoluteFillObject,
  },
});
