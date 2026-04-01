import type { ReactElement, ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import type { CategorySlug } from '../api/potterdb';

type Props = { size?: number; color?: string; glow?: boolean };

function GlowWrap({
  children,
  size,
  glow,
  color,
  viewBox,
}: {
  children: ReactNode;
  size: number;
  glow?: boolean;
  color: string;
  viewBox: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={viewBox}
      style={
        glow
          ? {
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.95,
              shadowRadius: 10,
            }
          : undefined
      }
    >
      {children}
    </Svg>
  );
}

export function ArchiveBooksIcon({ size = 44, color = colors.sicklyGreen, glow = true }: Props) {
  return (
    <GlowWrap size={size} glow={glow} color={color} viewBox="0 0 44 44">
      <Rect x="4" y="8" width="18" height="32" rx="1" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="10" y="6" width="18" height="32" rx="1" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="16" y="4" width="18" height="32" rx="1" fill="none" stroke={color} strokeWidth="2" />
      <Path d="M22 14h8M22 20h8M22 26h6" stroke={color} strokeWidth="1.4" />
    </GlowWrap>
  );
}

export function ArchiveCharactersIcon({ size = 40, color = colors.sicklyGreen, glow = true }: Props) {
  return (
    <GlowWrap size={size} glow={glow} color={color} viewBox="0 0 44 44">
      <Circle cx="18" cy="16" r="8" fill="none" stroke={color} strokeWidth="2" />
      <Path d="M6 38c4-9 9-12 12-12s8 3 12 12" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="28" cy="22" r="10" fill="none" stroke={color} strokeWidth="1.6" opacity="0.85" />
      <Path d="M32 18l4 4M31 31l5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="35" cy="17" r="2" fill="none" stroke={color} strokeWidth="1.4" />
    </GlowWrap>
  );
}

export function ArchiveMoviesIcon({ size = 40, color = colors.sicklyGreen, glow = true }: Props) {
  return (
    <GlowWrap size={size} glow={glow} color={color} viewBox="0 0 44 44">
      <Rect x="4" y="10" width="36" height="24" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="8" y="14" width="6" height="16" fill="none" stroke={color} strokeWidth="1.2" />
      <Rect x="16" y="14" width="6" height="16" fill="none" stroke={color} strokeWidth="1.2" />
      <Rect x="24" y="14" width="6" height="16" fill="none" stroke={color} strokeWidth="1.2" />
      <Rect x="32" y="14" width="4" height="16" fill="none" stroke={color} strokeWidth="1.2" />
      <Path d="M4 18h-2v12h2M40 18h2v12h-2" stroke={color} strokeWidth="1.6" />
    </GlowWrap>
  );
}

export function ArchivePotionsIcon({ size = 40, color = colors.neonOrange, glow = true }: Props) {
  return (
    <GlowWrap size={size} glow={glow} color={color} viewBox="0 0 44 44">
      <Path d="M18 4h8v6l-2 4h-4l-2-4V4z" fill="none" stroke={color} strokeWidth="2" />
      <Path d="M12 16h20l-2 22H14L12 16z" fill="none" stroke={color} strokeWidth="2" />
      <Path d="M16 24h12M16 30h10" stroke={color} strokeWidth="1.2" opacity="0.8" />
    </GlowWrap>
  );
}

export function ArchiveSpellsIcon({ size = 40, color = colors.sicklyGreen, glow = true }: Props) {
  return (
    <GlowWrap size={size} glow={glow} color={color} viewBox="0 0 44 44">
      <Path
        d="M8 8h14a4 4 0 014 4v20a4 4 0 01-4 4H8V8z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M22 8h14a4 4 0 014 4v20a4 4 0 01-4 4H22V8z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M12 16h8M12 22h6M12 28h8" stroke={color} strokeWidth="1.3" />
      <Path d="M26 16h8M26 22h6M26 28h8" stroke={color} strokeWidth="1.3" />
    </GlowWrap>
  );
}

const ICONS: Record<CategorySlug, (p: Props) => ReactElement> = {
  books: ArchiveBooksIcon,
  characters: ArchiveCharactersIcon,
  movies: ArchiveMoviesIcon,
  potions: ArchivePotionsIcon,
  spells: ArchiveSpellsIcon,
};

export function ArchiveCategoryIcon({
  kind,
  size,
  tabStyle,
  active,
}: {
  kind: CategorySlug;
  size?: number;
  tabStyle?: boolean;
  active?: boolean;
}) {
  const Icon = ICONS[kind];
  const muted = colors.labelMuted;
  const color =
    tabStyle && !active
      ? muted
      : kind === 'potions' && !tabStyle
        ? colors.neonOrange
        : colors.sicklyGreen;
  return (
    <Icon
      size={size ?? (tabStyle ? 22 : 40)}
      color={color}
      glow={!tabStyle || !!active}
    />
  );
}
