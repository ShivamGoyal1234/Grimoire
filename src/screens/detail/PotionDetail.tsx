import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { MagicTap } from '../../components/MagicTap';
import type { DetailNav } from './types';
import { stable01, sansBtn } from './helpers';

const POTION_CARD = '#121212';
const POTION_RUST = '#A55D35';
const FINDINGS_LAB =
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80&auto=format';
const FINDINGS_BOTANICAL =
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&auto=format';

function batchNumber(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String((h % 900) + 100).padStart(3, '0');
}

function potencyStars(difficulty: unknown, id: string): number {
  const d = typeof difficulty === 'string' ? difficulty.toLowerCase() : '';
  if (d.includes('beginner') || d.includes('easy')) return 2;
  if (d.includes('moderate') || d.includes('ordinary')) return 3;
  if (d.includes('advanced') || d.includes('hard') || d.includes('complex')) return 4;
  const n = 2 + Math.floor(stable01(`${id}:stars`) * 3);
  return Math.min(5, Math.max(2, n));
}

function brewCyclesLabel(time: unknown, id: string): string {
  if (typeof time === 'string' && time.trim().length > 0) {
    const t = time.trim();
    if (/cycle/i.test(t)) return t.toUpperCase();
    return `${t.toUpperCase()} CYCLES`;
  }
  const n = 6 + Math.floor(stable01(`${id}:brew`) * 22);
  return `${n} CYCLES`;
}

const INGREDIENT_UNITS = [
  'Scruples',
  'Drops',
  'Handfuls',
  'Sprigs',
  'Grains',
  'Pinches',
] as const;

function parseIngredientRows(
  ingredients: unknown,
  id: string
): { name: string; qty: string }[] {
  if (typeof ingredients !== 'string' || !ingredients.trim()) return [];
  const parts = ingredients
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.map((name, i) => {
    const n = 1 + ((i * 7 + (id.charCodeAt(0) || 0)) % 12);
    const unit = INGREDIENT_UNITS[i % INGREDIENT_UNITS.length];
    return { name, qty: `${n} ${unit}` };
  });
}

function StarRating({ filled }: { filled: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 5 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 20,
            color:
              i <= filled ? colors.sicklyGreen : 'rgba(255,255,255,0.22)',
          }}
        >
          {i <= filled ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

export function PotionDetail({
  attrs,
  title,
  imageUrl,
  id,
  wiki,
  navigation,
}: {
  attrs: Record<string, unknown>;
  title: string;
  imageUrl: string | null;
  id: string;
  wiki: string | null;
  navigation: DetailNav;
}) {
  const batch = batchNumber(id);
  const diff =
    typeof attrs.difficulty === 'string' ? attrs.difficulty : 'Unclassified';
  const disclaimer = `Restricted brew — ${diff}. Use with extreme caution under proper supervision.`;
  const effect = typeof attrs.effect === 'string' ? attrs.effect.trim() : '';
  const characteristics =
    typeof attrs.characteristics === 'string' ? attrs.characteristics.trim() : '';
  const essence =
    [effect, characteristics].filter(Boolean).join(' ') ||
    'No occult essence has been transcribed for this phial.';
  const stars = potencyStars(attrs.difficulty, id);
  const brew = brewCyclesLabel(attrs.time, id);
  const rows = parseIngredientRows(attrs.ingredients, id);
  const sideFx =
    typeof attrs.side_effects === 'string' ? attrs.side_effects.trim() : '';
  const inventors =
    typeof attrs.inventors === 'string' ? attrs.inventors.trim() : '';
  const manufacturers =
    typeof attrs.manufacturers === 'string' ? attrs.manufacturers.trim() : '';

  return (
    <View style={styles.root}>
      <View style={styles.headerBlock}>
        <Text style={styles.batchLine}>BATCH #{batch}</Text>
        <Text style={styles.potionTitle}>{title}</Text>
        <Text style={styles.disclaimer} numberOfLines={3}>
          {disclaimer}
        </Text>
      </View>

      <View style={styles.heroGlowWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.heroImg} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImg, styles.heroFallback]}>
            <Text style={styles.heroFallbackTxt}>No phial image</Text>
          </View>
        )}
      </View>

      <View style={styles.essenceCard}>
        <Text style={styles.essenceTitle}>The Occult Essence</Text>
        <Text style={styles.essenceBody}>{essence}</Text>
      </View>

      <View style={styles.potionStatsRow}>
        <View style={styles.potionStatTile}>
          <Text style={styles.potionStatLabel}>POTENCY LEVEL</Text>
          <StarRating filled={stars} />
        </View>
        <View style={styles.potionStatTile}>
          <Text style={styles.potionStatLabel}>BREW TIME</Text>
          <Text style={styles.brewValue}>{brew}</Text>
        </View>
      </View>

      <Text style={styles.compositionHead}>THE COMPOSITION</Text>
      <View style={styles.compositionBox}>
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <View
              key={`${row.name}-${i}`}
              style={[styles.ingRow, i > 0 && styles.ingRowBorder]}
            >
              <Text style={styles.ingName}>{row.name}</Text>
              <Text style={styles.ingQty}>{row.qty}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.ingEmpty}>No ingredients on file.</Text>
        )}
      </View>

      <MagicTap
        onPress={() => (wiki ? Linking.openURL(wiki) : undefined)}
        style={[styles.cta, styles.ctaPrimary, !wiki && styles.ctaDisabled]}
      >
        <Text style={styles.ctaPrimaryTxt}>BEGIN TRANSCRIPTION</Text>
      </MagicTap>
      <MagicTap
        onPress={() => navigation.navigate('List', { category: 'potions' })}
        style={[styles.cta, styles.ctaGhost]}
      >
        <Text style={styles.ctaGhostTxt}>RETURN TO VAULT</Text>
      </MagicTap>

      <Text style={styles.findingsLabel}>RESEARCHER'S FINDINGS</Text>
      <View style={styles.findingsRow}>
        <MagicTap
          style={styles.findingCard}
          onPress={() => (wiki ? Linking.openURL(wiki) : undefined)}
        >
          <Image source={{ uri: FINDINGS_LAB }} style={styles.findingImg} />
          <Text style={styles.findingCap}>Reaction Log</Text>
        </MagicTap>
        <MagicTap
          style={styles.findingCard}
          onPress={() => (wiki ? Linking.openURL(wiki) : undefined)}
        >
          <Image
            source={{ uri: FINDINGS_BOTANICAL }}
            style={styles.findingImg}
          />
          <Text style={styles.findingCap}>Botanical Notes</Text>
        </MagicTap>
      </View>

      {sideFx ? (
        <View style={styles.extraBlock}>
          <Text style={styles.extraLabel}>Side effects</Text>
          <Text style={styles.extraVal}>{sideFx}</Text>
        </View>
      ) : null}
      {inventors ? (
        <View style={styles.extraBlock}>
          <Text style={styles.extraLabel}>Inventors</Text>
          <Text style={styles.extraVal}>{inventors}</Text>
        </View>
      ) : null}
      {manufacturers ? (
        <View style={styles.extraBlock}>
          <Text style={styles.extraLabel}>Manufacturers</Text>
          <Text style={styles.extraVal}>{manufacturers}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 12,
  },
  headerBlock: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  batchLine: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: colors.ghostWhite,
  },
  potionTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 26,
    color: colors.sicklyGreen,
    textAlign: 'right',
    marginTop: 6,
    maxWidth: '100%',
  },
  disclaimer: {
    fontFamily: sansBtn,
    fontSize: 11,
    color: 'rgba(232,232,208,0.52)',
    textAlign: 'right',
    marginTop: 10,
    lineHeight: 16,
    maxWidth: '100%',
  },
  heroGlowWrap: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 360,
    alignSelf: 'center',
    marginBottom: 22,
    borderRadius: 2,
    backgroundColor: POTION_CARD,
    shadowColor: colors.sicklyGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 16,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  heroFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: POTION_CARD,
  },
  heroFallbackTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.4)',
  },
  essenceCard: {
    backgroundColor: POTION_CARD,
    borderLeftWidth: 3,
    borderLeftColor: POTION_RUST,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  essenceTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 20,
    color: colors.sicklyGreen,
    marginBottom: 10,
  },
  essenceBody: {
    fontFamily: 'IMFellEnglish_400Regular_Italic',
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(232,232,208,0.92)',
  },
  potionStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  potionStatTile: {
    flex: 1,
    backgroundColor: POTION_CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    minWidth: 0,
  },
  potionStatLabel: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.9,
    color: colors.labelMuted,
    marginBottom: 10,
  },
  brewValue: {
    fontFamily: sansBtn,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.sicklyGreen,
  },
  compositionHead: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 22,
    color: POTION_RUST,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  compositionBox: {
    backgroundColor: POTION_CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 18,
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  ingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  ingName: {
    flex: 1,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    color: colors.ghostWhite,
  },
  ingQty: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 12,
    color: 'rgba(165, 93, 53, 0.95)',
  },
  ingEmpty: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 14,
    color: 'rgba(232,232,208,0.45)',
    padding: 14,
  },
  cta: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 2,
  },
  ctaPrimary: {
    backgroundColor: colors.sicklyGreen,
  },
  ctaDisabled: {
    opacity: 0.38,
  },
  ctaPrimaryTxt: {
    fontFamily: sansBtn,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 13,
    color: colors.archiveBlack,
  },
  ctaGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(232,232,208,0.28)',
    marginBottom: 26,
  },
  ctaGhostTxt: {
    fontFamily: sansBtn,
    fontWeight: '600',
    letterSpacing: 2,
    fontSize: 13,
    color: colors.ghostWhite,
  },
  findingsLabel: {
    fontFamily: sansBtn,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.labelMuted,
    textAlign: 'center',
    marginBottom: 14,
  },
  findingsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  findingCard: {
    flex: 1,
    backgroundColor: POTION_CARD,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.22)',
    minWidth: 0,
  },
  findingImg: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#0a0a0a',
  },
  findingCap: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.sicklyGreen,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(8,8,8,0.95)',
  },
  extraBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  extraLabel: {
    fontFamily: sansBtn,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.labelMuted,
    marginBottom: 6,
  },
  extraVal: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 14,
    color: 'rgba(232,232,208,0.75)',
    lineHeight: 21,
  },
});
