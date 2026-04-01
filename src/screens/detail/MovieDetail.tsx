import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { MagicTap } from '../../components/MagicTap';
import { sansBtn } from './helpers';

function runtimeLabel(raw: unknown): string {
  if (raw == null) return 'Unknown duration';
  const t = String(raw).trim();
  if (!t) return 'Unknown duration';
  if (/min|hour|hr|h/i.test(t)) return t;
  if (/^\d+$/.test(t)) return `${t} min`;
  return t;
}

function moneyLabel(raw: unknown): string {
  if (raw == null) return 'Unknown';
  const t = String(raw).trim();
  if (!t) return 'Unknown';
  return /^\d/.test(t) ? `$${t}` : t;
}

function stripTagline(summary: string): string {
  if (!summary.trim()) return 'No archive notes have been transcribed for this film.';
  return summary.length > 260 ? `${summary.slice(0, 257)}...` : summary;
}

function vaultCode(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) >>> 0;
  const serial = String((h % 9000) + 1000);
  return `VAULT-${serial}`;
}

export function MovieDetail({
  attrs,
  title,
  imageUrl,
  id,
  wiki,
}: {
  attrs: Record<string, unknown>;
  title: string;
  imageUrl: string | null;
  id: string;
  wiki: string | null;
}) {
  const release = typeof attrs.release_date === 'string' ? attrs.release_date : 'Unknown year';
  const directors = typeof attrs.directors === 'string' ? attrs.directors : 'Unknown director';
  const runtime = runtimeLabel(attrs.running_time);
  const budget = moneyLabel(attrs.budget);
  const boxOffice = moneyLabel(attrs.box_office);
  const summary = typeof attrs.summary === 'string' ? stripTagline(attrs.summary) : stripTagline('');
  const archiveCode = vaultCode(id);

  return (
    <View style={styles.root}>
      <Text style={styles.shelfLine}>HOGWARTS FILM ARCHIVE</Text>
      <Text style={styles.movieTitle}>{title}</Text>
      <Text style={styles.subLine}>
        RELEASED {String(release).toUpperCase()} · LEDGER {archiveCode}
      </Text>

      <View style={styles.posterWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={styles.posterFallbackTxt}>Poster unavailable</Text>
          </View>
        )}
        <View style={styles.posterSeal}>
          <Text style={styles.posterSealTxt}>MINISTRY COPY</Text>
        </View>
      </View>

      <View style={styles.synopsisCard}>
        <Text style={styles.synopsisHead}>Forbidden Synopsis</Text>
        <Text style={styles.synopsisBody}>{summary}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>DIRECTOR</Text>
          <Text style={styles.statValue}>{directors}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>RUNTIME</Text>
          <Text style={styles.statValue}>{runtime}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>BUDGET</Text>
          <Text style={styles.statValue}>{budget}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>BOX OFFICE</Text>
          <Text style={styles.statValue}>{boxOffice}</Text>
        </View>
      </View>

      {wiki ? (
        <MagicTap onPress={() => Linking.openURL(wiki)} style={styles.cta}>
          <Text style={styles.ctaTxt}>OPEN COMPLETE ARCHIVE ENTRY</Text>
        </MagicTap>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 12,
  },
  shelfLine: {
    fontFamily: sansBtn,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: colors.labelMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  movieTitle: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 30,
    color: colors.ghostWhite,
    textAlign: 'center',
    marginBottom: 8,
  },
  subLine: {
    fontFamily: sansBtn,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: 'rgba(232,232,208,0.62)',
    textAlign: 'center',
    marginBottom: 16,
  },
  posterWrap: {
    position: 'relative',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.34)',
    backgroundColor: 'rgba(10,10,14,0.94)',
    padding: 8,
  },
  poster: {
    width: '100%',
    height: 370,
    backgroundColor: '#0b0b0f',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterFallbackTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.45)',
  },
  posterSeal: {
    position: 'absolute',
    right: 14,
    top: 14,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.58)',
    backgroundColor: 'rgba(0,0,0,0.62)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  posterSealTxt: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#d4a574',
  },
  synopsisCard: {
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.25)',
    backgroundColor: 'rgba(14,14,20,0.88)',
    padding: 14,
    marginBottom: 16,
  },
  synopsisHead: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 20,
    color: colors.sicklyGreen,
    marginBottom: 8,
  },
  synopsisBody: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(232,232,208,0.9)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
    gap: 10,
  },
  statTile: {
    width: '48%',
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(10,10,10,0.94)',
    padding: 12,
  },
  statLabel: {
    fontFamily: sansBtn,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.labelMuted,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    color: colors.ghostWhite,
    lineHeight: 20,
  },
  cta: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sicklyGreen,
    borderRadius: 2,
  },
  ctaTxt: {
    fontFamily: sansBtn,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.archiveBlack,
  },
});
