import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { useAlert } from '@/template';
import { estimateLabel, formatDZD } from '@/services/currency';
import { Button } from '@/components/ui/Button';

const PRESETS = [5000, 10000, 20000, 50000];

export default function TopUpScreen() {
  const router = useRouter();
  const wallet = useWallet();
  const { t, isRTL } = useLocale();
  const { showAlert } = useAlert();
  const [amount, setAmount] = useState<number>(10000);
  const [customText, setCustomText] = useState('');

  const displayAmount = useMemo(() => {
    if (customText.trim()) {
      const n = Number(customText.replace(/[^0-9]/g, ''));
      return isNaN(n) ? 0 : n;
    }
    return amount;
  }, [amount, customText]);

  const confirm = () => {
    if (displayAmount < 1000) {
      showAlert(t('topup.tooLow'), t('topup.tooLowMsg'));
      return;
    }
    wallet.topUp(displayAmount);
    showAlert(
      t('topup.success'),
      t('topup.successMsg', { amount: formatDZD(displayAmount) }),
      [{ text: t('topup.great'), onPress: () => router.back() }]
    );
  };

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('topup.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.previewCard, shadows.card]}>
          <Text style={styles.previewLabel}>{t('topup.willAdd')}</Text>
          <Text style={styles.previewAmount}>{formatDZD(displayAmount)}</Text>
          <Text style={styles.previewEst}>
            {estimateLabel(displayAmount, wallet.preferredCurrency)}
          </Text>
        </View>

        <Text style={[styles.section, rtlText]}>{t('topup.choose')}</Text>
        <View style={styles.grid}>
          {PRESETS.map((p) => {
            const active = amount === p && !customText.trim();
            return (
              <Pressable
                key={p}
                onPress={() => {
                  setAmount(p);
                  setCustomText('');
                }}
                style={({ pressed }) => [
                  styles.presetCell,
                  active && styles.presetCellActive,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>
                  {formatDZD(p)}
                </Text>
                <Text style={[styles.presetEst, active && styles.presetEstActive]}>
                  {estimateLabel(p, wallet.preferredCurrency)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.section, rtlText]}>{t('topup.custom')}</Text>
        <View style={styles.customBox}>
          <Text style={styles.currencyPrefix}>DZD</Text>
          <TextInput
            style={styles.customInput}
            keyboardType="number-pad"
            value={customText}
            onChangeText={setCustomText}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={18} color={colors.info} />
          <Text style={[styles.infoText, rtlText]}>{t('topup.info')}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t('topup.confirm', { amount: formatDZD(displayAmount) })}
          onPress={confirm}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { ...typography.h2, color: colors.text },
  content: { paddingHorizontal: spacing.base, paddingBottom: 20 },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewLabel: { ...typography.caption, color: colors.textSubtle },
  previewAmount: { ...typography.displayLg, color: colors.text, marginTop: 6 },
  previewEst: {
    ...typography.bodyMedium,
    color: colors.emphasis,
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetCell: {
    width: '48%',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.base,
  },
  presetCellActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '25',
  },
  presetLabel: { ...typography.bodyMedium, color: colors.text },
  presetLabelActive: { color: colors.primary, fontWeight: '700' },
  presetEst: { ...typography.small, color: colors.textSubtle, marginTop: 2 },
  presetEstActive: { color: colors.primary },
  customBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
  },
  currencyPrefix: {
    ...typography.h3,
    color: colors.textSubtle,
    marginRight: 8,
  },
  customInput: {
    flex: 1,
    ...typography.h2,
    color: colors.text,
    paddingVertical: 14,
  },
  infoBox: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.info + '12',
    borderRadius: radii.md,
    gap: 8,
  },
  infoText: {
    ...typography.small,
    color: colors.textSubtle,
    flex: 1,
    lineHeight: 18,
    marginLeft: 6,
  },
  footer: {
    padding: spacing.base,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
