import { useEffect, useState } from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { MagicTap } from '../../components/MagicTap';
import { DetailFieldRow } from './DetailFieldRow';
import type { DetailNav } from './types';
import { romanFromProgress, stable01, sansBtn } from './helpers';

const CHARACTER_PLACEHOLDER = require('../../../assets/images/golden_trio.png');

function arcanePotency(id: string): number {
  return Math.floor(stable01(`${id}:arc`) * 22) + 74;
}

function corruptionFromBlood(blood: unknown): { label: string; color: string } {
  const b = typeof blood === 'string' ? blood.toLowerCase() : '';
  if (b.includes('pure')) return { label: 'High', color: '#d4a574' };
  if (b.includes('half')) return { label: 'Moderate', color: '#c9a227' };
  if (b.includes('muggle')) return { label: 'Low', color: 'rgba(232,232,208,0.72)' };
  return { label: 'Unknown', color: 'rgba(232,232,208,0.5)' };
}

const bodyFieldsCharacter: { label: string; key: string }[] = [
  { label: 'Gender', key: 'gender' },
  { label: 'Born', key: 'born' },
  { label: 'Hair', key: 'hair_color' },
  { label: 'Eyes', key: 'eye_color' },
  { label: 'Patronus', key: 'patronus' },
  { label: 'Boggart', key: 'boggart' },
];

function MasteryRow({
  icon,
  name,
  progress,
  barColor,
  roman,
}: {
  icon: string;
  name: string;
  progress: number;
  barColor: string;
  roman: string;
}) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <View style={styles.masteryRow}>
      <Text style={styles.masteryIcon}>{icon}</Text>
      <View style={styles.masteryMid}>
        <Text style={styles.masteryName}>{name}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { flex: p, backgroundColor: barColor }]} />
          <View style={{ flex: 1 - p }} />
        </View>
      </View>
      <Text style={styles.masteryRoman}>{roman}</Text>
    </View>
  );
}

export function CharacterDetail({
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
  const house = typeof attrs.house === 'string' ? attrs.house : null;
  const species = typeof attrs.species === 'string' ? attrs.species : null;
  const rolePill = (species || 'Wizard').toUpperCase();
  const alive =
    attrs.alive === true || attrs.dead === false || attrs.dead === 'false';
  const potency = arcanePotency(id);
  const corruption = corruptionFromBlood(attrs.blood_status);
  const summary = typeof attrs.summary === 'string' ? attrs.summary.trim() : '';

  const patronusStr =
    typeof attrs.patronus === 'string' && attrs.patronus.length > 0
      ? attrs.patronus
      : null;
  const progPatronus = patronusStr
    ? 0.72 + stable01(`${id}:pat`) * 0.22
    : 0.32 + stable01(`${id}:pat`) * 0.28;
  const progDuel = 0.45 + stable01(`${id}:duel`) * 0.48;

  const chronicle =
    summary ||
    [typeof attrs.born === 'string' ? `Born: ${attrs.born}.` : null, house ? `House ${house}.` : null]
      .filter(Boolean)
      .join(' ') ||
    'No chronicle text was sealed in the archive for this name.';

  const skipKeys = new Set(['summary', 'house', 'species', 'blood_status']);

  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <View style={styles.root}>
      <View style={styles.portraitShell}>
        {showImage && imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.portrait}
            resizeMode="contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Image
            source={CHARACTER_PLACEHOLDER}
            style={styles.portrait}
            resizeMode="contain"
            accessibilityLabel="Placeholder portrait"
          />
        )}
        <View style={styles.statusBadge} accessibilityLabel={alive ? 'Alive' : 'Status'}>
          <Text style={styles.statusGlyph}>✦</Text>
        </View>
      </View>

      <Text style={styles.name}>{title}</Text>

      <View style={styles.subRow}>
        <View style={styles.rolePill}>
          <Text style={styles.rolePillTxt}>{rolePill}</Text>
        </View>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.houseLine}>
          HOUSE {house ? house.toUpperCase() : 'UNAFFILIATED'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statHead}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statLabel}>ARCANE POTENCY</Text>
          </View>
          <View style={styles.statValueRow}>
            <Text style={styles.statBig}>{potency}</Text>
            <Text style={styles.statDenom}>/ 100</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHead}>
            <Text style={styles.statIcon}>💀</Text>
            <Text style={styles.statLabel}>CORRUPTION LEVEL</Text>
          </View>
          <Text style={[styles.corruptionWord, { color: corruption.color }]}>
            {corruption.label}
          </Text>
        </View>
      </View>

      <Text style={styles.chronicleTitle}>The Forbidden Chronicle</Text>
      <Text style={styles.chronicleBody}>
        {chronicle}
        {wiki ? (
          <>
            {' '}
            <Text style={styles.chronicleLink} onPress={() => Linking.openURL(wiki)}>
              Cursed Obol
            </Text>
            <Text style={styles.chronicleBody}> — the wider record awaits.</Text>
          </>
        ) : null}
      </Text>

      <MagicTap
        onPress={() => (wiki ? Linking.openURL(wiki) : undefined)}
        style={[styles.cta, styles.ctaPrimary, !wiki && styles.ctaDisabled]}
      >
        <Text style={styles.ctaPrimaryTxt}>INVOKE PRESENCE</Text>
      </MagicTap>
      <MagicTap
        onPress={() => navigation.navigate('List', { category: 'spells' })}
        style={[styles.cta, styles.ctaGhost]}
      >
        <Text style={styles.ctaGhostTxt}>VIEW RELICS</Text>
      </MagicTap>

      <Text style={styles.masterySection}>DARK ARTS MASTERY</Text>

      <MasteryRow
        icon="◆"
        name="Shadow Manipulation"
        progress={progPatronus}
        barColor={colors.sicklyGreen}
        roman={romanFromProgress(progPatronus)}
      />
      <MasteryRow
        icon="◇"
        name="Void Summoning"
        progress={progDuel}
        barColor="#ff4a2e"
        roman={romanFromProgress(progDuel)}
      />

      {bodyFieldsCharacter.map(({ label, key }) => {
        if (skipKeys.has(key)) return null;
        const v = attrs[key];
        if (v == null || v === '') return null;
        const str = Array.isArray(v) ? v.join(', ') : String(v);
        if (!str.length) return null;
        return <DetailFieldRow key={key} label={label} value={str} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 8,
  },
  portraitShell: {
    width: '100%',
    marginBottom: 28,
    position: 'relative',
    maxHeight: 300,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  portrait: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.4)',
    backgroundColor: colors.archiveBlack,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    backgroundColor: colors.sicklyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.sicklyGreen,
    shadowOpacity: 0.85,
    shadowRadius: 10,
  },
  statusGlyph: {
    color: colors.archiveBlack,
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 32,
    color: colors.ghostWhite,
    marginBottom: 10,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 22,
    gap: 8,
  },
  rolePill: {
    backgroundColor: 'rgba(12,12,12,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  rolePillTxt: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.sicklyGreen,
  },
  dot: {
    color: 'rgba(232,232,208,0.5)',
    fontSize: 16,
  },
  houseLine: {
    fontFamily: sansBtn,
    fontSize: 13,
    fontWeight: '600',
    color: colors.ghostWhite,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(10,10,10,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    minWidth: 0,
  },
  statHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  statIcon: { fontSize: 12 },
  statLabel: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.labelMuted,
    flex: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statBig: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 36,
    color: colors.sicklyGreen,
  },
  statDenom: {
    fontFamily: sansBtn,
    fontSize: 14,
    color: 'rgba(232,232,208,0.45)',
    marginLeft: 4,
  },
  corruptionWord: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 26,
    marginTop: 2,
  },
  chronicleTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 22,
    color: colors.ghostWhite,
    marginBottom: 12,
  },
  chronicleBody: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(232,232,208,0.92)',
    marginBottom: 20,
  },
  chronicleLink: {
    color: colors.sicklyGreen,
    textDecorationLine: 'underline',
    fontFamily: 'IMFellEnglish_400Regular',
  },
  cta: {
    paddingVertical: 14,
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
  },
  ctaGhostTxt: {
    fontFamily: sansBtn,
    fontWeight: '600',
    letterSpacing: 2,
    fontSize: 13,
    color: colors.ghostWhite,
  },
  masterySection: {
    fontFamily: sansBtn,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    color: colors.labelMuted,
    marginTop: 8,
    marginBottom: 16,
  },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  masteryIcon: {
    color: colors.sicklyGreen,
    fontSize: 14,
    width: 20,
  },
  masteryMid: {
    flex: 1,
    minWidth: 0,
  },
  masteryName: {
    fontFamily: 'IMFellEnglish_400Regular_Italic',
    fontSize: 16,
    color: 'rgba(232,232,208,0.9)',
    marginBottom: 8,
  },
  barTrack: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  masteryRoman: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 20,
    color: 'rgba(232,232,208,0.85)',
    width: 36,
    textAlign: 'right',
  },
});
