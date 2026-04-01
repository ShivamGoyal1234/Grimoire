import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const W = 72;
const H = 96;

export function HourglassLoader() {
  const drip = useSharedValue(0);

  useEffect(() => {
    drip.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [drip]);

  const sandTop = useAnimatedStyle(() => ({
    height: 22 + drip.value * 10,
    opacity: 0.55 + drip.value * 0.35,
  }));

  const sandBottom = useAnimatedStyle(() => ({
    height: 32 - drip.value * 10,
    opacity: 0.45 + (1 - drip.value) * 0.35,
  }));

  const drop = useAnimatedStyle(() => ({
    transform: [{ translateY: drip.value * 28 }],
    opacity: 0.2 + drip.value * 0.75,
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Polygon
          points={`${W / 2},8 8,${H / 2 - 6} ${W - 8},${H / 2 - 6}`}
          fill="none"
          stroke={colors.rust}
          strokeWidth={2}
        />
        <Polygon
          points={`8,${H / 2 + 6} ${W - 8},${H / 2 + 6} ${W / 2},${H - 8}`}
          fill="none"
          stroke={colors.rust}
          strokeWidth={2}
        />
        <Line
          x1={W / 2}
          y1={H / 2 - 2}
          x2={W / 2}
          y2={H / 2 + 2}
          stroke={colors.sicklyGreen}
          strokeWidth={2}
        />
      </Svg>
      <View style={styles.sandLayer} pointerEvents="none">
        <Animated.View style={[styles.sandTop, sandTop]} />
        <Animated.View style={[styles.sandDrop, drop]} />
        <Animated.View style={[styles.sandBottom, sandBottom]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: W,
    height: H,
  },
  sandLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sandTop: {
    position: 'absolute',
    top: 14,
    width: 36,
    backgroundColor: colors.ghostWhite,
    borderRadius: 2,
    opacity: 0.7,
  },
  sandBottom: {
    position: 'absolute',
    bottom: 14,
    width: 44,
    backgroundColor: colors.ghostWhite,
    borderRadius: 2,
    opacity: 0.55,
  },
  sandDrop: {
    position: 'absolute',
    top: H / 2 - 2,
    width: 3,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.sicklyGreen,
    shadowColor: colors.sicklyGreen,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
});
