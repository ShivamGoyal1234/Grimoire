import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

type Spark = { id: string; dx: number; dy: number };

function SparkBurst({ dx, dy }: { dx: number; dy: number }) {
  const p = useSharedValue(0);
  const o = useSharedValue(1);

  useEffect(() => {
    p.value = withTiming(1, { duration: 280 });
    o.value = withSequence(withTiming(1, { duration: 40 }), withTiming(0, { duration: 240 }));
  }, [p, o]);

  const style = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [
      { translateX: dx * p.value },
      { translateY: dy * p.value },
      { scale: 1 - p.value * 0.45 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.spark,
        style,
        {
          shadowColor: colors.sicklyGreen,
          shadowOpacity: 1,
          shadowRadius: 6,
        },
      ]}
    />
  );
}

export function MagicTap({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const burst = useSharedValue(0);

  const triggerSparks = useCallback(
    (x: number, y: number) => {
      setOrigin({ x, y });
      const next: Spark[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.35;
        const dist = 16 + Math.random() * 24;
        next.push({
          id: `${Date.now()}-${i}`,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        });
      }
      setSparks(next);
      burst.value = withSequence(withTiming(1, { duration: 90 }), withTiming(0, { duration: 220 }));
      setTimeout(() => setSparks([]), 340);
    },
    [burst]
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: burst.value * 0.4,
  }));

  return (
    <Pressable
      style={[styles.wrap, style]}
      onPress={(e) => {
        const { locationX, locationY } = e.nativeEvent;
        triggerSparks(locationX, locationY);
        onPress?.();
      }}
    >
      {children}
      <Animated.View pointerEvents="none" style={[styles.flash, overlayStyle]} />
      <View
        pointerEvents="none"
        style={[styles.sparkOrigin, { left: origin.x - 2, top: origin.y - 2 }]}
      >
        {sparks.map((s) => (
          <SparkBurst key={s.id} dx={s.dx} dy={s.dy} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    overflow: 'visible',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.sicklyGreen,
  },
  sparkOrigin: {
    position: 'absolute',
    width: 4,
    height: 4,
  },
  spark: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sicklyGreen,
    left: 0,
    top: 0,
  },
});
