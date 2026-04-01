import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { MagicTap } from '../../components/MagicTap';
import { FlickerText } from '../../components/FlickerText';
import type { DetailNav } from './types';
import { ROMAN, stable01, sansBtn } from './helpers';

const POTION_CARD = '#121212';
const SPELL_COPPER = '#b87333';

function forbiddenTierRoman(id: string, category: unknown): string {
  const c = typeof category === 'string' ? category.toLowerCase() : '';
  let base = 4;
  if (c.includes('curse') || c.includes('dark')) base = 8;
  else if (c.includes('charm')) base = 2;
  else if (c.includes('hex')) base = 5;
  else if (c.includes('jinx')) base = 4;
  else if (c.includes('transfiguration')) base = 6;
  const jitter = Math.floor(stable01(`${id}:ftier`) * 3);
  const idx = Math.min(11, Math.max(0, base + jitter - 1));
  return ROMAN[idx];
}

function spellCastCycles(id: string): string {
  return `${2 + Math.floor(stable01(`${id}:cast`) * 9)} Cycles`;
}

function spellEssenceMana(id: string): string {
  return `${55 + Math.floor(stable01(`${id}:mana`) * 44)} Mana`;
}

function spellReagentRows(attrs: Record<string, unknown>): { icon: string; text: string }[] {
  const out: { icon: string; text: string }[] = [];
  const effect = typeof attrs.effect === 'string' ? attrs.effect.trim() : '';
  const hand = typeof attrs.hand === 'string' ? attrs.hand.trim() : '';
  const light = typeof attrs.light === 'string' ? attrs.light.trim() : '';
  if (effect) {
    const line = effect.length > 92 ? `${effect.slice(0, 89)}…` : effect;
    out.push({ icon: '💀', text: line });
  }
  if (hand) {
    out.push({ icon: '💧', text: hand });
  } else if (light) {
    out.push({
      icon: '💧',
      text: `A vial of ${light.toLowerCase()} threadlight, stoppered with intent.`,
    });
  }
  if (out.length === 0) {
    return [
      { icon: '💀', text: 'Ashes of a forgotten king, sifted through moonless ash.' },
      { icon: '💧', text: 'Pure liquid sorrow — tears caught mid-fall from a phoenix shadow.' },
    ];
  }
  if (out.length === 1) {
    out.push({
      icon: '💧',
      text: 'Crystallized intent drawn from the veil between breath and word.',
    });
  }
  return out.slice(0, 4);
}

export function SpellDetail({
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
  const tierRoman = forbiddenTierRoman(id, attrs.category);
  const kind =
    typeof attrs.category === 'string' && attrs.category.trim().length > 0
      ? attrs.category.trim()
      : null;
  const incantation =
    typeof attrs.incantation === 'string' && attrs.incantation.trim().length > 0
      ? attrs.incantation.trim()
      : null;
  const effect = typeof attrs.effect === 'string' ? attrs.effect.trim() : '';
  const incantFallback =
    effect.length > 0
      ? `Ex silentio, vis magicae surgit… ${effect.charAt(0).toLowerCase()}${effect.slice(1)}`
      : 'Ex nihilo, umbra surgit — the archive offers no spoken form for this working.';
  const instruction =
    typeof attrs.hand === 'string' && attrs.hand.length > 0
      ? `Speak these words while ${attrs.hand.charAt(0).toLowerCase()}${attrs.hand.slice(1)}.`
      : 'Speak these words while clutching the wand to the heart-line beneath the new moon’s gaze.';
  const reagents = spellReagentRows(attrs);
  const cast = spellCastCycles(id);
  const mana = spellEssenceMana(id);
  const creator = typeof attrs.creator === 'string' ? attrs.creator.trim() : '';

  return (
    <View style={styles.root}>
      {imageUrl ? (
        <View style={styles.spellIllWrap}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.spellIllImg}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={[styles.spellIllWrap, styles.spellIllFallback]}>
          <Text style={styles.spellIllFallbackTxt}>No sigil image</Text>
        </View>
      )}

      <Text style={styles.tierLine}>FORBIDDEN TIER {tierRoman}</Text>
      <Text style={[styles.spellName, { marginBottom: kind ? 8 : 22 }]}>{title}</Text>
      {kind ? <Text style={styles.spellKind}>{kind.toUpperCase()}</Text> : null}

      <View style={styles.incantationFrame}>
        <Text style={[styles.cornerStar, styles.cornerTL]}>✧</Text>
        <Text style={[styles.cornerStar, styles.cornerTR]}>✧</Text>
        <Text style={[styles.cornerStar, styles.cornerBL]}>✧</Text>
        <Text style={[styles.cornerStar, styles.cornerBR]}>✧</Text>
        <View style={styles.incantationInner}>
          {incantation ? (
            <FlickerText text={incantation} />
          ) : (
            <Text style={styles.incantFallback}>{incantFallback}</Text>
          )}
        </View>
        <View style={styles.sparkRow}>
          <Text style={styles.spark}>✦</Text>
          <Text style={styles.spark}>✦</Text>
          <Text style={styles.spark}>✦</Text>
        </View>
        <Text style={styles.instruction}>{instruction}</Text>
      </View>

      <View style={styles.reagentBlock}>
        <Text style={styles.reagentHead}>REAGENTS REQUIRED</Text>
        {reagents.map((r, i) => (
          <View
            key={`${r.text.slice(0, 24)}-${i}`}
            style={[styles.reagentRow, i > 0 && styles.reagentRowBorder]}
          >
            <Text style={styles.reagentIcon}>{r.icon}</Text>
            <Text style={styles.reagentTxt}>{r.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.spellStatsRow}>
        <View style={styles.spellStatTile}>
          <View style={styles.spellStatHead}>
            <Text style={styles.spellStatIcon}>⏳</Text>
            <Text style={styles.spellStatLabel}>CAST TIME</Text>
          </View>
          <Text style={styles.spellStatVal}>{cast}</Text>
        </View>
        <View style={styles.spellStatTile}>
          <View style={styles.spellStatHead}>
            <Text style={styles.spellStatIcon}>⚡</Text>
            <Text style={styles.spellStatLabel}>ESSENCE COST</Text>
          </View>
          <Text style={styles.spellStatVal}>{mana}</Text>
        </View>
      </View>

      <MagicTap
        onPress={() => (wiki ? Linking.openURL(wiki) : undefined)}
        style={[styles.spellCta, styles.spellCtaPrimary, !wiki && styles.spellCtaOff]}
      >
        <Text style={styles.spellCtaTxt}>INVOKE MANIFESTATION</Text>
      </MagicTap>
      <MagicTap
        onPress={() => navigation.navigate('List', { category: 'spells' })}
        style={[styles.spellCta, styles.spellCtaGhost]}
      >
        <Text style={styles.spellCtaGhostTxt}>RETURN TO GRIMOIRE</Text>
      </MagicTap>
      <Text style={styles.caution}>
        CAUTION: SPELL FAILURE MAY RESULT IN PERMANENT SOUL FRAGMENTATION.
      </Text>

      {creator ? (
        <View style={styles.spellExtra}>
          <Text style={styles.spellExtraLabel}>Creator</Text>
          <Text style={styles.spellExtraVal}>{creator}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 12,
  },
  tierLine: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(232,232,208,0.55)',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 8,
  },
  spellName: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 30,
    color: colors.ghostWhite,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  spellKind: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: SPELL_COPPER,
    textAlign: 'center',
    marginBottom: 22,
  },
  incantationFrame: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.42)',
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: 'rgba(10,10,16,0.62)',
  },
  cornerStar: {
    position: 'absolute',
    color: colors.sicklyGreen,
    fontSize: 15,
    opacity: 0.9,
  },
  cornerTL: { top: 8, left: 8 },
  cornerTR: { top: 8, right: 8 },
  cornerBL: { bottom: 8, left: 8 },
  cornerBR: { bottom: 8, right: 8 },
  incantationInner: {
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  incantFallback: {
    fontFamily: 'IMFellEnglish_400Regular_Italic',
    fontSize: 17,
    lineHeight: 28,
    color: colors.sicklyGreen,
    textAlign: 'center',
    textShadowColor: 'rgba(184,154,98,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sparkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 12,
  },
  spark: {
    color: colors.sicklyGreen,
    fontSize: 12,
    opacity: 0.95,
  },
  instruction: {
    fontFamily: 'IMFellEnglish_400Regular_Italic',
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(232,232,208,0.82)',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  reagentBlock: {
    backgroundColor: POTION_CARD,
    borderLeftWidth: 3,
    borderLeftColor: SPELL_COPPER,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  reagentHead: {
    fontFamily: sansBtn,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: SPELL_COPPER,
    marginBottom: 12,
  },
  reagentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
  },
  reagentRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  reagentIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  reagentTxt: {
    flex: 1,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.ghostWhite,
  },
  spellStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  spellStatTile: {
    flex: 1,
    backgroundColor: POTION_CARD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    minWidth: 0,
  },
  spellStatHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  spellStatIcon: {
    fontSize: 16,
  },
  spellStatLabel: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.9,
    color: colors.labelMuted,
    flex: 1,
  },
  spellStatVal: {
    fontFamily: sansBtn,
    fontSize: 15,
    fontWeight: '800',
    color: colors.sicklyGreen,
    letterSpacing: 0.3,
  },
  spellCta: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 2,
  },
  spellCtaPrimary: {
    backgroundColor: colors.sicklyGreen,
    shadowColor: colors.sicklyGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  spellCtaOff: {
    opacity: 0.38,
  },
  spellCtaTxt: {
    fontFamily: sansBtn,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 13,
    color: colors.archiveBlack,
  },
  spellCtaGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(232,232,208,0.28)',
    marginBottom: 16,
  },
  spellCtaGhostTxt: {
    fontFamily: sansBtn,
    fontWeight: '600',
    letterSpacing: 2,
    fontSize: 13,
    color: colors.ghostWhite,
  },
  caution: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: SPELL_COPPER,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  spellIllWrap: {
    width: '100%',
    height: 280,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.25)',
    backgroundColor: '#0a0a0a',
    marginBottom: 4,
    overflow: 'hidden',
  },
  spellIllImg: {
    width: '100%',
    height: '100%',
  },
  spellIllFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spellIllFallbackTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.4)',
  },
  spellExtra: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  spellExtraLabel: {
    fontFamily: sansBtn,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.labelMuted,
    marginBottom: 6,
  },
  spellExtraVal: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 14,
    color: 'rgba(232,232,208,0.75)',
  },
});
