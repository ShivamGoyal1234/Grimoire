import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CategorySlug } from '../api/potterdb';
import { colors } from '../theme/colors';
import { rootNavigationRef } from '../navigation/rootNavigationRef';
import { MagicTap } from './MagicTap';
import { ArchiveCategoryIcon } from './ArchiveCategoryIcons';

const ORDER: { slug: CategorySlug; label: string }[] = [
  { slug: 'books', label: 'BOOKS' },
  { slug: 'characters', label: 'CHARACTERS' },
  { slug: 'movies', label: 'MOVIES' },
  { slug: 'potions', label: 'POTIONS' },
  { slug: 'spells', label: 'SPELLS' },
];

export function ArchiveBottomNav({ activeTab }: { activeTab: CategorySlug | null }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8) + (Platform.OS === 'android' ? 2 : 0),
        },
      ]}
    >
      {ORDER.map(({ slug, label }) => {
        const on = activeTab === slug;
        return (
          <MagicTap
            key={slug}
            onPress={() => rootNavigationRef.navigate('List', { category: slug })}
            style={styles.item}
          >
            <ArchiveCategoryIcon kind={slug} tabStyle size={24} active={on} />
            <Text
              style={[styles.itemLabel, on && styles.itemLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </MagicTap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 10,
    backgroundColor: colors.archiveBlack,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(184,154,98,0.2)',
    zIndex: 20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  itemLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.labelMuted,
    fontWeight: '600',
  },
  itemLabelActive: {
    color: colors.sicklyGreen,
    textShadowColor: colors.sicklyGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
