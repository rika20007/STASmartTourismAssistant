import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { WalletTransaction } from '@/contexts/WalletContext';
import { formatDZD } from '@/services/currency';
import { useLocale } from '@/hooks/useLocale';
import { localeToBCP47 } from '@/services/i18n';

export function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const { t, locale } = useLocale();
  const isCredit = tx.type === 'topup' || tx.type === 'refund';
  const icon =
    tx.type === 'topup'
      ? 'add-circle'
      : tx.type === 'refund'
      ? 'undo'
      : 'shopping-bag';
  const color = isCredit ? colors.success : colors.text;

  const date = new Date(tx.createdAt);
  const timeLabel = date.toLocaleString(localeToBCP47(locale), {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fallbackTitle = tx.type === 'topup' ? t('tx.topup') : t('tx.payment');

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={icon as any} size={20} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.merchant ?? fallbackTitle}
        </Text>
        <Text style={styles.time}>{timeLabel}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {isCredit ? '+' : '-'}
        {formatDZD(tx.amountDZD)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.bodyMedium, color: colors.text },
  time: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  amount: { ...typography.bodyMedium, fontWeight: '700' },
});
