import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export function FlickerText({ text }: { text: string }) {
  const flicker = useSharedValue(1);

  useEffect(() => {
    flicker.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 80, easing: Easing.linear }),
        withTiming(1, { duration: 120, easing: Easing.linear }),
        withTiming(0.7, { duration: 60, easing: Easing.linear }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [flicker]);

  const style = useAnimatedStyle(() => ({
    opacity: flicker.value,
    textShadowRadius: 8 + flicker.value * 10,
  }));

  return (
    <Animated.Text style={[styles.txt, style]}>{text}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  txt: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 26,
    color: colors.sicklyGreen,
    textShadowColor: colors.sicklyGreen,
    textShadowOffset: { width: 0, height: 0 },
    textAlign: 'center',
    maxWidth: '100%',
  },
});
