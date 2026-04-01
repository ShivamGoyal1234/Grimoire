import { Text, View } from 'react-native';
import { detailScreenStyles } from './detailScreenStyles';

export function DetailFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailScreenStyles.row}>
      <Text style={detailScreenStyles.rowLabel}>{label}</Text>
      <Text style={detailScreenStyles.rowVal}>{value}</Text>
    </View>
  );
}
