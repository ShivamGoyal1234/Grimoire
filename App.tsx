import { useCallback } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';
import {
  IMFellEnglish_400Regular,
  IMFellEnglish_400Regular_Italic,
} from '@expo-google-fonts/im-fell-english';
import * as SplashExpo from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashExpo.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [loaded, err] = useFonts({
    MedievalSharp_400Regular,
    IMFellEnglish_400Regular,
    IMFellEnglish_400Regular_Italic,
  });

  const onLayout = useCallback(() => {
    if (loaded || err) {
      SplashExpo.hideAsync().catch(() => {});
    }
  }, [loaded, err]);

  if (!loaded && !err) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#080808' }}>
          <StatusBar style="light" />
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
