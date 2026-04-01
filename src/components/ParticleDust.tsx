import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

function DustMote({ delay, seed }: { delay: number; seed: number }) {
  const ox = useMemo(() => (Math.sin(seed * 12.9898) * 0.5 + 0.5) * width, [seed]);
  const oy = useMemo(() => (Math.cos(seed * 78.233) * 0.5 + 0.5) * height, [seed]);
  const o = useSharedValue(0.2 + (seed % 7) * 0.05);

  useEffect(() => {
    o.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.65, { duration: 3500 + (seed % 5) * 400, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, [delay, o, seed]);

  const style = useAnimatedStyle(() => ({
    opacity: o.value,
  }));

  const size = 1 + (seed % 3) * 0.8;

  return (
    <Animated.View
      style={[
        styles.mote,
        style,
        {
          left: ox,
          top: oy,
          width: size,
          height: size,
          borderRadius: size,
        },
      ]}
    />
  );
}

export function ParticleDust({ count }: { count: number }) {
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {seeds.map((s, i) => (
        <DustMote key={s} seed={s} delay={i * 100} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mote: {
    position: 'absolute',
    backgroundColor: colors.ghostWhite,
    shadowColor: colors.sicklyGreen,
    shadowOpacity: 0.75,
    shadowRadius: 3,
  },
});
