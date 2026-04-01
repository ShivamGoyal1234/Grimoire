import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const G = colors.sicklyGreen;

export function GrimoireSigil() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.arcTop}>RELEASE</Text>
      <View style={styles.ring}>
        <View style={styles.diamondLayer}>
          <View style={styles.diamondOuter} />
        </View>
        <View style={styles.diamondLayer}>
          <View style={styles.diamondInner} />
        </View>
        <View style={styles.book}>
          <View style={styles.bookPage} />
          <View style={styles.bookPage} />
        </View>
      </View>
      <Text style={styles.arcBottom}>THE SEAL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 152,
    height: 152,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arcTop: {
    position: 'absolute',
    top: 0,
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: '600',
    color: G,
    zIndex: 2,
  },
  arcBottom: {
    position: 'absolute',
    bottom: 0,
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: '600',
    color: G,
    zIndex: 2,
  },
  ring: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: G,
    backgroundColor: 'rgba(10, 10, 14, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: G,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
  },
  diamondLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondOuter: {
    width: 78,
    height: 78,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.85)',
    transform: [{ rotate: '45deg' }],
  },
  diamondInner: {
    width: 52,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.65)',
    transform: [{ rotate: '45deg' }],
  },
  book: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 22,
  },
  bookPage: {
    width: 14,
    height: 18,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: G,
    borderRadius: 1,
    backgroundColor: 'rgba(184,154,98,0.12)',
  },
});
