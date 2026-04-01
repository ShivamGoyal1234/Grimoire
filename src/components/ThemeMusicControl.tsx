import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio, type AVPlaybackStatusSuccess } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const GREEN = colors.sicklyGreen;

const THEME_SOURCE = require('../../assets/audio/harry.mp3');

export function ThemeMusicControl({ tabBarVisible }: { tabBarVisible: boolean }) {
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch {
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          THEME_SOURCE,
          {
            isLooping: true,
            volume: 0.55,
            shouldPlay: false,
          },
          (status) => {
            if (!status.isLoaded) return;
            const s = status as AVPlaybackStatusSuccess;
            setPlaying(s.isPlaying);
          }
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        setReady(true);
      } catch {
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      const s = soundRef.current;
      soundRef.current = null;
      if (s) {
        s.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const onPress = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound || !ready) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setPlaying(false);
      } else {
        await sound.playAsync();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  }, [ready]);

  const bottomPad =
    Math.max(insets.bottom, 10) +
    (tabBarVisible ? (Platform.OS === 'android' ? 58 : 54) : 18);

  return (
    <View style={[styles.wrap, { bottom: bottomPad }]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        disabled={!ready}
        style={({ pressed }) => [
          styles.btn,
          !ready && styles.btnDisabled,
          pressed && ready && styles.btnPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Stop theme music' : 'Play theme music'}
      >
        <Text style={styles.icon}>{playing ? '■' : '▶'}</Text>
        <Text style={styles.caption} numberOfLines={1}>
          {playing ? 'Stop' : 'Theme'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 14,
    zIndex: 200,
    alignItems: 'flex-end',
    paddingBottom: 35,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(184,154,98,0.35)',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnPressed: {
    opacity: 0.85,
  },
  icon: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '700',
    width: 14,
    textAlign: 'center',
  },
  caption: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 13,
    letterSpacing: 1,
    color: GREEN,
    opacity: 0.95,
  },
});
