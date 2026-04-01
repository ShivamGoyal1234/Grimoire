import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArchiveBottomNav } from '../components/ArchiveBottomNav';
import { GrimoireHeader } from '../components/GrimoireHeader';
import { ThemeMusicControl } from '../components/ThemeMusicControl';
import { colors } from '../theme/colors';
import {
  type ArchiveTabBarState,
  getArchiveTabBarState,
  rootNavigationRef,
} from './rootNavigationRef';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { ListScreen } from '../screens/ListScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { ChapterScreen } from '../screens/ChapterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.voidBlack,
    card: colors.voidBlack,
    primary: colors.sicklyGreen,
    text: colors.ghostWhite,
    border: 'rgba(184,154,98,0.25)',
  },
};

export function RootNavigator() {
  const [archiveTab, setArchiveTab] = useState<ArchiveTabBarState>({
    show: false,
    activeTab: null,
    routeName: null,
  });

  const syncArchiveTab = useCallback(() => {
    setArchiveTab(getArchiveTabBarState());
  }, []);

  return (
    <NavigationContainer
      ref={rootNavigationRef}
      theme={navTheme}
      onReady={syncArchiveTab}
      onStateChange={syncArchiveTab}
    >
      <View style={{ flex: 1 }}>
        {archiveTab.show && archiveTab.routeName ? (
          <GrimoireHeader routeName={archiveTab.routeName} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.voidBlack },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Categories" component={CategoryScreen} />
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Chapter" component={ChapterScreen} />
          </Stack.Navigator>
        </View>
        {archiveTab.show ? (
          <ArchiveBottomNav activeTab={archiveTab.activeTab} />
        ) : null}
        <ThemeMusicControl tabBarVisible={archiveTab.show} />
      </View>
    </NavigationContainer>
  );
}
