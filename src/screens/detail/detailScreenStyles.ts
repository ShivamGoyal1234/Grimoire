import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const detailScreenStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  loader: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  loaderTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    color: 'rgba(232,232,208,0.55)',
  },
  heroTitleFlat: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 30,
    color: colors.ghostWhite,
    marginBottom: 12,
  },
  mute: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 17,
    color: 'rgba(232,232,208,0.45)',
  },
  cover: {
    width: '100%',
    height: 220,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139,37,0,0.5)',
  },
  row: {
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(139,37,0,0.55)',
    paddingLeft: 10,
  },
  rowLabel: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 13,
    color: 'rgba(184,154,98,0.62)',
    marginBottom: 4,
  },
  rowVal: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    color: 'rgba(232,232,208,0.88)',
    lineHeight: 22,
  },
  chapterBox: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(184,154,98,0.35)',
    padding: 10,
    backgroundColor: 'rgba(8,8,8,0.45)',
  },
  chapterHead: {
    fontFamily: 'MedievalSharp_400Regular',
    fontSize: 18,
    color: colors.ghostWhite,
    marginBottom: 10,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232,232,208,0.08)',
  },
  chapterTxt: {
    flex: 1,
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    color: colors.ghostWhite,
    paddingRight: 8,
  },
  chapterArrow: {
    fontFamily: 'MedievalSharp_400Regular',
    color: colors.sicklyGreen,
    fontSize: 22,
  },
  wiki: {
    marginTop: 20,
    paddingVertical: 12,
  },
  wikiTxt: {
    fontFamily: 'IMFellEnglish_400Regular',
    fontSize: 15,
    color: colors.sicklyGreen,
  },
});
