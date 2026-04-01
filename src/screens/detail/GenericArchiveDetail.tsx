import { Image, Linking, Text, View } from 'react-native';
import type { CategorySlug } from '../../api/potterdb';
import { MagicTap } from '../../components/MagicTap';
import { DetailFieldRow } from './DetailFieldRow';
import type { DetailNav } from './types';
import { detailScreenStyles as styles } from './detailScreenStyles';

const BODY_FIELDS: { label: string; key: string }[] = [
  { label: 'Summary', key: 'summary' },
  { label: 'Effect', key: 'effect' },
  { label: 'Ingredients', key: 'ingredients' },
  { label: 'Characteristics', key: 'characteristics' },
  { label: 'Difficulty', key: 'difficulty' },
  { label: 'Category', key: 'category' },
  { label: 'Light', key: 'light' },
  { label: 'Hand', key: 'hand' },
  { label: 'Directors', key: 'directors' },
  { label: 'Release', key: 'release_date' },
  { label: 'Runtime', key: 'running_time' },
  { label: 'Budget', key: 'budget' },
  { label: 'Box office', key: 'box_office' },
  { label: 'Author', key: 'author' },
  { label: 'Pages', key: 'pages' },
  { label: 'Blood', key: 'blood_status' },
  { label: 'Species', key: 'species' },
  { label: 'Gender', key: 'gender' },
  { label: 'Born', key: 'born' },
  { label: 'Hair', key: 'hair_color' },
  { label: 'Eyes', key: 'eye_color' },
  { label: 'Patronus', key: 'patronus' },
  { label: 'Boggart', key: 'boggart' },
];

export function GenericArchiveDetail({
  category,
  attrs,
  title,
  imageUrl,
  id,
  wiki,
  chapters,
  navigation,
}: {
  category: CategorySlug;
  attrs: Record<string, unknown>;
  title: string;
  imageUrl: string | null;
  id: string;
  wiki: string | null;
  chapters: { id: string; title: string }[];
  navigation: DetailNav;
}) {
  return (
    <>
      <Text style={styles.heroTitleFlat}>{title}</Text>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View
          style={[
            styles.cover,
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(8,8,8,0.6)',
            },
          ]}
        >
          <Text style={[styles.mute, { textAlign: 'center', fontSize: 15 }]}>
            No image available
          </Text>
        </View>
      )}

      {BODY_FIELDS.map(({ label, key }) => {
        const v = attrs[key];
        if (v == null || v === '') return null;
        const str = Array.isArray(v) ? v.join(', ') : String(v);
        if (!str.length) return null;
        return <DetailFieldRow key={key} label={label} value={str} />;
      })}

      {category === 'books' && chapters.length > 0 ? (
        <View style={styles.chapterBox}>
          <Text style={styles.chapterHead}>Chapters</Text>
          {chapters.map((c) => (
            <MagicTap
              key={c.id}
              onPress={() =>
                navigation.navigate('Chapter', { bookId: id, chapterId: c.id })
              }
              style={styles.chapterRow}
            >
              <Text style={styles.chapterTxt}>{c.title}</Text>
              <Text style={styles.chapterArrow}>›</Text>
            </MagicTap>
          ))}
        </View>
      ) : null}

      {wiki ? (
        <MagicTap onPress={() => Linking.openURL(wiki)} style={styles.wiki}>
          <Text style={styles.wikiTxt}>Follow the thread to the wider wiki →</Text>
        </MagicTap>
      ) : null}
    </>
  );
}
