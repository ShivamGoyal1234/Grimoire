import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors } from '../theme/colors';
import { MagicTap } from './MagicTap';

export function ErrorMirror({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.frame}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Line x1="8%" y1="18%" x2="78%" y2="88%" stroke={colors.ghostWhite} strokeWidth={1.2} opacity={0.35} />
          <Line x1="88%" y1="12%" x2="22%" y2="92%" stroke={colors.ghostWhite} strokeWidth={0.9} opacity={0.28} />
          <Line x1="4%" y1="62%" x2="96%" y2="38%" stroke={colors.sicklyGreen} strokeWidth={0.8} opacity={0.22} />
        </Svg>
        <Text style={styles.title}>The magic has failed you</Text>
        <Text style={styles.sub}>The mirror remembers nothing. Try again, if you dare.</Text>
        {onRetry ? (
          <MagicTap onPress={onRetry} style={styles.btn}>
            <Text style={styles.btnText}>Attempt another binding</Text>
          </MagicTap>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  frame: {
    width: '100%',
    maxWidth: 340,
    minHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(232,232,208,0.25)',
    backgroundColor: 'rgba(8,8,8,0.65)',
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 22,
    color: colors.ghostWhite,
    textAlign: 'center',
    marginBottom: 10,
  },
  sub: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 16,
    color: 'rgba(232,232,208,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.sicklyGreen,
  },
  btnText: {
    fontFamily: 'MedievalSharp_400Regular',
    color: colors.sicklyGreen,
    fontSize: 15,
  },
});
