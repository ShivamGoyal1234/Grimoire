import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function ShimmerParchment({ height = 88 }: { height?: number }) {
  const x = useSharedValue(-1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [x]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 140 }],
    opacity: 0.35 + Math.abs(x.value) * 0.25,
  }));

  return (
    <View style={[styles.box, { height }]}>
      <Animated.View style={[styles.shimmer, style]}>
        <LinearGradient
          colors={['transparent', 'rgba(232,232,208,0.25)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    backgroundColor: 'rgba(26,15,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(139,37,0,0.45)',
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: '60%',
  },
});
