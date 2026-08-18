import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { formatDZD, estimateLabel, Currency } from '@/services/currency';
import { useLocale } from '@/hooks/useLocale';

interface WalletCardProps {
  balanceDZD: number;
  currency: Currency;
  onTopUp?: () => void;
  onScan?: () => void;
  onSwitchCurrency?: () => void;
}

export function WalletCard({
  balanceDZD,
  currency,
  onTopUp,
  onScan,
  onSwitchCurrency,
}: WalletCardProps) {
  const { t } = useLocale();

  return (
    <View style={[styles.wrap, shadows.hero]}>
      <Image
        source={require('@/assets/images/wallet-hero.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoDot} />
          <Text style={styles.brand}>{t('wallet.brand')}</Text>
        </View>
        <Pressable style={styles.currencyBtn} onPress={onSwitchCurrency} hitSlop={8}>
          <Text style={styles.currencyBtnText}>{currency}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.textInverse} />
        </Pressable>
      </View>

      <View style={styles.balanceBlock}>
        <Text style={styles.label}>{t('wallet.available')}</Text>
        <Text style={styles.balance}>{formatDZD(balanceDZD)}</Text>
        <View style={styles.estRow}>
          <MaterialIcons name="swap-horiz" size={14} color={colors.emphasisLight} />
          <Text style={styles.est}>{estimateLabel(balanceDZD, currency)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onTopUp}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <MaterialIcons name="add" size={18} color={colors.primary} />
          <Text style={styles.actionText}>{t('wallet.topUp')}</Text>
        </Pressable>
        <Pressable
          onPress={onScan}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBtnPrimary,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <MaterialIcons name="qr-code-scanner" size={18} color={colors.textInverse} />
          <Text style={[styles.actionText, { color: colors.textInverse }]}>
            {t('wallet.scanPay')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xxl,
    overflow: 'hidden',
    padding: spacing.lg,
    minHeight: 220,
    backgroundColor: colors.surfaceDark,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 42, 42, 0.62)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.emphasis,
    marginRight: 8,
  },
  brand: {
    ...typography.caption,
    color: colors.textInverse,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  currencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  currencyBtnText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
    marginRight: 2,
  },
  balanceBlock: { marginTop: spacing.xl },
  label: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  balance: {
    ...typography.displayLg,
    color: colors.textInverse,
  },
  estRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  est: {
    ...typography.caption,
    color: colors.emphasisLight,
    fontWeight: '600',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: 12,
    gap: 6,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
  },
  actionText: {
    ...typography.h3,
    color: colors.primary,
    marginLeft: 6,
  },
});
