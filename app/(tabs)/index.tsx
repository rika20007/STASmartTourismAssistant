import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, spacing, typography, radii } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { WalletCard } from '@/components/feature/WalletCard';
import { QuickAction } from '@/components/feature/QuickAction';
import { TransactionRow } from '@/components/feature/TransactionRow';
import { PartnerCard } from '@/components/feature/PartnerCard';
import { partners } from '@/services/mockPartners';
import { supportedCurrencies } from '@/services/currency';
import { useAlert } from '@/template';

export default function WalletHomeScreen() {
  const router = useRouter();
  const wallet = useWallet();
  const { t, isRTL } = useLocale();
  const { showAlert } = useAlert();

  const nearby = partners.slice(0, 4);

  const onSwitchCurrency = useCallback(() => {
    showAlert(
      t('currency.title'),
      t('currency.desc'),
      supportedCurrencies.map((c) => ({
        text: `${c.flag}  ${c.label} (${c.code})`,
        onPress: () => wallet.setPreferredCurrency(c.code),
      }))
    );
  }, [showAlert, wallet, t]);

  const rtlText = isRTL ? { textAlign: 'right' as const, writingDirection: 'rtl' as const } : undefined;

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greet, rtlText]}>{t('home.greeting')}</Text>
            <Text style={[styles.subGreet, rtlText]}>{t('home.subGreeting')}</Text>
          </View>
          <Pressable
            style={styles.notif}
            onPress={() =>
              showAlert(t('home.notifications'), t('home.notif.allCaught'))
            }
          >
            <MaterialIcons name="notifications-none" size={22} color={colors.text} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.base }}>
          <WalletCard
            balanceDZD={wallet.balanceDZD}
            currency={wallet.preferredCurrency}
            onTopUp={() => router.push('/topup')}
            onScan={() => router.push('/pay')}
            onSwitchCurrency={onSwitchCurrency}
          />
        </View>

        <View style={styles.quickRow}>
          <QuickAction
            icon="qr-code-scanner"
            label={t('quick.scanPay')}
            color={colors.primary}
            onPress={() => router.push('/pay')}
          />
          <QuickAction
            icon="add-circle-outline"
            label={t('quick.topUp')}
            color={colors.emphasis}
            onPress={() => router.push('/topup')}
          />
          <QuickAction
            icon="explore"
            label={t('quick.explore')}
            color={colors.info}
            onPress={() => router.push('/partners')}
          />
          <QuickAction
            icon="auto-awesome"
            label={t('quick.assistant')}
            color={colors.success}
            onPress={() => router.push('/assistant')}
          />
        </View>

        <View style={styles.currencyStrip}>
          <MaterialIcons name="info-outline" size={16} color={colors.emphasis} />
          <Text style={[styles.currencyStripText, rtlText]}>
            {t('home.currencyBanner', { currency: wallet.preferredCurrency })}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={commonStyles.sectionTitle}>{t('home.recent')}</Text>
            <Pressable
              onPress={() =>
                showAlert(t('home.fullHistory'), t('home.fullHistoryMsg'))
              }
            >
              <Text style={styles.link}>{t('home.seeAll')}</Text>
            </Pressable>
          </View>
          <View style={styles.txCard}>
            {wallet.transactions.slice(0, 4).map((tx, idx) => (
              <View key={tx.id}>
                <TransactionRow tx={tx} />
                {idx < Math.min(wallet.transactions.length, 4) - 1 ? (
                  <View style={commonStyles.divider} />
                ) : null}
              </View>
            ))}
            {wallet.transactions.length === 0 ? (
              <Text style={styles.empty}>{t('home.noTx')}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={commonStyles.sectionTitle}>{t('home.nearby')}</Text>
            <Pressable onPress={() => router.push('/partners')}>
              <Text style={styles.link}>{t('home.explore')}</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.base, gap: 12 }}
          >
            {nearby.map((p) => (
              <PartnerCard
                key={p.id}
                partner={p}
                currency={wallet.preferredCurrency}
                compact
                onPress={() => router.push(`/partner/${p.id}`)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  greet: { ...typography.h1, color: colors.text },
  subGreet: { ...typography.caption, color: colors.textSubtle, marginTop: 2 },
  notif: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emphasis,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    marginTop: spacing.lg,
    gap: 6,
  },
  currencyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.emphasisLight + '55',
    borderRadius: radii.md,
    gap: 8,
  },
  currencyStripText: {
    ...typography.small,
    color: colors.text,
    flex: 1,
    marginLeft: 6,
  },
  section: { marginTop: spacing.xl },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  link: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  txCard: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
});
