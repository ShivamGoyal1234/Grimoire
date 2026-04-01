import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export function BurnShell({ children }: { children: React.ReactNode }) {
  const burn = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      burn.value = 1;
      burn.value = withTiming(0, { duration: 420 });
    }, [burn])
  );

  const overlay = useAnimatedStyle(() => ({
    opacity: burn.value * 0.5,
  }));

  return (
    <>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.burn, overlay]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  burn: {
    backgroundColor: colors.ember,
    zIndex: 4,
  },
});
