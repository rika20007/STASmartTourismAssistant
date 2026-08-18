import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { useAlert } from '@/template';
import { supportedCurrencies } from '@/services/currency';
import { supportedLocales } from '@/services/i18n';

export default function ProfileScreen() {
  const wallet = useWallet();
  const { t, locale, setLocale, isRTL } = useLocale();
  const { showAlert } = useAlert();
  const [offline, setOffline] = React.useState(true);
  const [notifs, setNotifs] = React.useState(true);

  const currentLangLabel =
    supportedLocales.find((l) => l.code === locale)?.nativeLabel ?? 'English';

  const chooseCurrency = useCallback(() => {
    showAlert(
      t('currency.title'),
      t('currency.desc'),
      supportedCurrencies.map((c) => ({
        text: `${c.flag}  ${c.label} (${c.code})`,
        onPress: () => wallet.setPreferredCurrency(c.code),
      }))
    );
  }, [showAlert, wallet, t]);

  const chooseLanguage = useCallback(() => {
    showAlert(
      t('profile.languageTitle'),
      t('profile.languageDesc'),
      supportedLocales.map((l) => ({
        text: `${l.flag}  ${l.nativeLabel}`,
        onPress: () => setLocale(l.code),
      }))
    );
  }, [showAlert, setLocale, t]);

  const report = () => {
    showAlert(t('profile.reportTitle'), t('profile.reportMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.reportContinue'),
        onPress: () =>
          showAlert(t('profile.reportThank'), t('profile.reportThankMsg')),
      },
    ]);
  };

  const resetWallet = () => {
    showAlert(t('profile.resetConfirm'), t('profile.resetMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.resetBtn'), style: 'destructive', onPress: () => wallet.reset() },
    ]);
  };

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={36} color={colors.primary} />
          </View>
          <Text style={styles.name}>{t('profile.name')}</Text>
          <Text style={styles.email}>{t('profile.email')}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <MaterialIcons name="verified" size={14} color={colors.primary} />
              <Text style={styles.badgeText}>{t('profile.kyc')}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.emphasisLight }]}>
              <MaterialIcons name="flight" size={14} color={colors.emphasis} />
              <Text style={[styles.badgeText, { color: colors.emphasis }]}>
                {t('profile.visitor')}
              </Text>
            </View>
          </View>
        </View>

        <Section title={t('profile.pref')}>
          <Row
            icon="translate"
            label={t('profile.language')}
            value={currentLangLabel}
            onPress={chooseLanguage}
          />
          <Row
            icon="attach-money"
            label={t('profile.currency')}
            value={wallet.preferredCurrency}
            onPress={chooseCurrency}
          />
          <Row
            icon="notifications"
            label={t('profile.notifications')}
            trailing={
              <Switch
                value={notifs}
                onValueChange={setNotifs}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            }
          />
          <Row
            icon="cloud-off"
            label={t('profile.offline')}
            hint={t('profile.offlineHint')}
            trailing={
              <Switch
                value={offline}
                onValueChange={setOffline}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            }
          />
        </Section>

        <Section title={t('profile.walletSec')}>
          <Row
            icon="lock"
            label={t('profile.pin')}
            value={t('profile.pinEnabled')}
            onPress={() => showAlert(t('profile.pinTitle'), t('profile.pinMsg'))}
          />
          <Row
            icon="account-balance"
            label={t('profile.refund')}
            hint={t('profile.refundHint')}
            onPress={() =>
              showAlert(t('profile.refundTitle'), t('profile.refundMsg'))
            }
          />
          <Row icon="refresh" label={t('profile.reset')} onPress={resetWallet} danger />
        </Section>

        <Section title={t('profile.support')}>
          <Row
            icon="report-problem"
            label={t('profile.report')}
            hint={t('profile.reportHint')}
            onPress={report}
          />
          <Row
            icon="help-outline"
            label={t('profile.help')}
            onPress={() => showAlert(t('profile.helpTitle'), t('profile.helpMsg'))}
          />
          <Row
            icon="privacy-tip"
            label={t('profile.privacy')}
            onPress={() =>
              showAlert(t('profile.privacyTitle'), t('profile.privacyMsg'))
            }
          />
        </Section>

        <View style={styles.compFooter}>
          <MaterialIcons name="emoji-events" size={18} color={colors.emphasis} />
          <Text style={[styles.compFooterText, rtlText]}>{t('profile.compFooter')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

interface RowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  hint?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  danger?: boolean;
}

function Row({ icon, label, value, hint, onPress, trailing, danger }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: onPress && pressed ? 0.7 : 1 }]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: (danger ? colors.danger : colors.primary) + '18' },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.primary}
        />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={[styles.rowLabel, danger && { color: colors.danger }]} numberOfLines={1}>
          {label}
        </Text>
        {hint ? (
          <Text style={styles.rowHint} numberOfLines={1}>
            {hint}
          </Text>
        ) : null}
      </View>
      {trailing ??
        (value ? (
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{value}</Text>
            {onPress ? (
              <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
            ) : null}
          </View>
        ) : onPress ? (
          <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
        ) : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { ...typography.h1, color: colors.text },
  email: { ...typography.caption, color: colors.textSubtle, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '40',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginHorizontal: 4,
    gap: 4,
  },
  badgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.base },
  sectionTitle: {
    ...typography.small,
    color: colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { ...typography.bodyMedium, color: colors.text },
  rowHint: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { ...typography.caption, color: colors.textSubtle, marginRight: 4 },
  compFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  compFooterText: {
    ...typography.small,
    color: colors.textSubtle,
    marginLeft: 6,
  },
});
