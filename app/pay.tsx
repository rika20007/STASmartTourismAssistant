import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { partners } from '@/services/mockPartners';
import { estimateLabel, formatDZD } from '@/services/currency';
import { Button } from '@/components/ui/Button';
import { useAlert } from '@/template';

type Phase = 'scanning' | 'preview' | 'success';

export default function PayScreen() {
  const router = useRouter();
  const wallet = useWallet();
  const { t, isRTL } = useLocale();
  const { showAlert } = useAlert();
  const [phase, setPhase] = useState<Phase>('scanning');

  const target = useMemo(() => {
    const p = partners[Math.floor(Math.random() * partners.length)];
    const amount = Math.round((p.averageDZD * (0.6 + Math.random() * 0.8)) / 50) * 50;
    return { partner: p, amount };
  }, []);

  useEffect(() => {
    if (phase === 'scanning') {
      const timer = setTimeout(() => setPhase('preview'), 1400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const confirm = () => {
    const r = wallet.pay(target.amount, target.partner.name);
    if (!r.ok) {
      const key =
        r.reason === 'INSUFFICIENT'
          ? 'pay.reason.insufficient'
          : r.reason === 'INVALID_AMOUNT'
          ? 'pay.reason.invalidAmount'
          : null;
      showAlert(t('pay.failed'), key ? t(key) : t('pay.tryAgain'));
      return;
    }
    setPhase('success');
  };

  const reject = () => {
    showAlert(t('pay.rejected'), t('pay.rejectedMsg'), [
      { text: t('common.ok'), onPress: () => router.back() },
    ]);
  };

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfaceDark }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={22} color={colors.textInverse} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {phase === 'scanning' ? t('pay.scan') : phase === 'preview' ? t('pay.confirm') : t('pay.success')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {phase === 'scanning' ? <ScannerView hint={t('pay.aligning')} sub={t('pay.scanHint')} /> : null}

      {phase === 'preview' ? (
        <View style={styles.previewWrap}>
          <View style={[styles.previewCard, shadows.hero]}>
            <View style={styles.merchRow}>
              <View style={styles.avatar}>
                <MaterialIcons name="storefront" size={22} color={colors.primary} />
              </View>
              <View style={{ marginLeft: spacing.md, flex: 1 }}>
                <Text style={styles.merchName}>{target.partner.name}</Text>
                <Text style={styles.merchLoc}>
                  {target.partner.neighborhood} · {target.partner.city}
                </Text>
              </View>
              {target.partner.verified ? (
                <MaterialIcons name="verified" size={22} color={colors.primary} />
              ) : null}
            </View>

            <View style={styles.divider} />

            <Text style={[styles.dueLabel, rtlText]}>{t('pay.amountToPay')}</Text>
            <Text style={styles.dueAmount}>{formatDZD(target.amount)}</Text>
            <View style={styles.estRow}>
              <MaterialIcons name="swap-horiz" size={16} color={colors.emphasis} />
              <Text style={styles.estText}>
                {estimateLabel(target.amount, wallet.preferredCurrency)} · {t('pay.estimateOnly')}
              </Text>
            </View>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>{t('pay.walletBalance')}</Text>
              <Text style={styles.balanceValue}>{formatDZD(wallet.balanceDZD)}</Text>
            </View>
          </View>

          <View style={styles.actionsCol}>
            <Button
              label={t('pay.confirmBtn', { amount: formatDZD(target.amount) })}
              onPress={confirm}
              size="lg"
            />
            <View style={{ height: 10 }} />
            <Button label={t('pay.reject')} onPress={reject} variant="ghost" size="lg" />
          </View>
        </View>
      ) : null}

      {phase === 'success' ? (
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <MaterialIcons name="check" size={44} color={colors.textInverse} />
          </View>
          <Text style={styles.successTitle}>{t('pay.complete')}</Text>
          <Text style={styles.successAmount}>{formatDZD(target.amount)}</Text>
          <Text style={styles.successMerch}>
            {t('pay.paidTo', { name: target.partner.name })}
          </Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>{t('pay.estimate')}</Text>
              <Text style={styles.successRowValue}>
                {estimateLabel(target.amount, wallet.preferredCurrency)}
              </Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>{t('pay.newBalance')}</Text>
              <Text style={styles.successRowValue}>{formatDZD(wallet.balanceDZD)}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>{t('pay.reference')}</Text>
              <Text style={styles.successRowValue}>STA-{Date.now().toString().slice(-6)}</Text>
            </View>
          </View>

          <View style={{ height: spacing.lg }} />
          <Button
            label={t('pay.ratePartner')}
            onPress={() => router.replace(`/partner/${target.partner.id}`)}
          />
          <View style={{ height: 8 }} />
          <Button label={t('common.done')} onPress={() => router.back()} variant="ghost" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ScannerView({ hint, sub }: { hint: string; sub: string }) {
  return (
    <View style={styles.scannerWrap}>
      <View style={styles.viewport}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
        <ActivityIndicator color={colors.emphasis} />
      </View>
      <Text style={styles.scanHint}>{hint}</Text>
      <Text style={styles.scanSub}>{sub}</Text>
    </View>
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
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: { ...typography.h2, color: colors.textInverse },

  scannerWrap: { flex: 1, alignItems: 'center', paddingTop: 40 },
  viewport: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: colors.emphasis,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: radii.lg },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: radii.lg },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: radii.lg },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: radii.lg },
  scanHint: { ...typography.h3, color: colors.textInverse, marginTop: spacing.xl },
  scanSub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 6,
  },

  previewWrap: { flex: 1, paddingHorizontal: spacing.base, justifyContent: 'space-between', paddingBottom: spacing.lg },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  merchRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchName: { ...typography.h2, color: colors.text },
  merchLoc: { ...typography.small, color: colors.textSubtle, marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  dueLabel: { ...typography.caption, color: colors.textSubtle },
  dueAmount: { ...typography.displayLg, color: colors.text, marginTop: 2 },
  estRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  estText: { ...typography.caption, color: colors.emphasis, fontWeight: '600', marginLeft: 4 },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  balanceLabel: { ...typography.caption, color: colors.textSubtle },
  balanceValue: { ...typography.bodyMedium, color: colors.text },
  actionsCol: {},

  successWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxl,
  },
  successBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { ...typography.h1, color: colors.textInverse, marginTop: spacing.lg },
  successAmount: { ...typography.displayLg, color: colors.emphasisLight, marginTop: spacing.sm },
  successMerch: { ...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  successCard: {
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.lg,
    padding: spacing.base,
    alignSelf: 'stretch',
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  successRowLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  successRowValue: { ...typography.bodyMedium, color: colors.textInverse },
});
