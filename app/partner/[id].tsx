import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { getPartner } from '@/services/mockPartners';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { estimateLabel, formatDZD } from '@/services/currency';
import { Button } from '@/components/ui/Button';
import { useAlert } from '@/template';

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const partner = getPartner(id ?? '');
  const router = useRouter();
  const wallet = useWallet();
  const { t, isRTL } = useLocale();
  const { showAlert } = useAlert();
  const [rating, setRating] = useState<number>(0);

  if (!partner) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundTitle}>{t('partner.notFound')}</Text>
        <Button label={t('partner.goBack')} onPress={() => router.back()} variant="ghost" />
      </SafeAreaView>
    );
  }

  const submitRating = () => {
    if (rating === 0) {
      showAlert(t('partner.selectRating'), t('partner.selectRatingMsg'));
      return;
    }
    showAlert(t('partner.thank'), t('partner.thankMsg', { n: rating }), [
      { text: t('partner.close'), onPress: () => router.back() },
    ]);
  };

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View>
          <Image
            source={{ uri: partner.cover }}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />
          <SafeAreaView edges={['top']} style={styles.headerBar}>
            <Pressable style={styles.headerBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              style={styles.headerBtn}
              onPress={() =>
                showAlert(
                  t('partner.share'),
                  t('partner.shareMsg', { name: partner.name })
                )
              }
            >
              <MaterialIcons name="share" size={20} color={colors.text} />
            </Pressable>
          </SafeAreaView>

          {partner.verified ? (
            <View style={styles.verified}>
              <MaterialIcons name="verified" size={14} color={colors.textInverse} />
              <Text style={styles.verifiedText}>{t('partner.verifiedTag')}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{partner.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <MaterialIcons name="star" size={14} color={colors.emphasis} />
              <Text style={styles.metaText}>
                {partner.rating.toFixed(1)} · {partner.ratingCount}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="place" size={14} color={colors.textSubtle} />
              <Text style={styles.metaText}>
                {partner.city} · {partner.distanceKm.toFixed(1)} km
              </Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcons name="qr-code-scanner" size={14} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.primary }]}>
                {t('partner.wallet')}
              </Text>
            </View>
          </View>

          <Text style={[styles.desc, rtlText]}>{partner.description}</Text>

          <View style={[styles.priceBlock, shadows.card]}>
            <View>
              <Text style={styles.priceLabel}>{t('partner.avgLabel')}</Text>
              <Text style={styles.priceAmount}>{formatDZD(partner.averageDZD)}</Text>
              <Text style={styles.priceEst}>
                {estimateLabel(partner.averageDZD, wallet.preferredCurrency)}
              </Text>
            </View>
            <View style={styles.levels}>
              {[1, 2, 3].map((l) => (
                <MaterialIcons
                  key={l}
                  name="attach-money"
                  size={18}
                  color={l <= partner.priceLevel ? colors.primary : colors.borderStrong}
                />
              ))}
            </View>
          </View>

          <Text style={[styles.section, rtlText]}>{t('partner.tags')}</Text>
          <View style={styles.tagsWrap}>
            {partner.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.section, rtlText]}>{t('partner.rateYourExp')}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={8}>
                <MaterialIcons
                  name={n <= rating ? 'star' : 'star-border'}
                  size={38}
                  color={colors.emphasis}
                />
              </Pressable>
            ))}
          </View>
          <View style={{ height: spacing.md }} />
          <Button label={t('partner.submit')} onPress={submitRating} />
          <View style={{ height: 8 }} />
          <Button
            label={t('partner.report')}
            variant="ghost"
            onPress={() =>
              showAlert(t('partner.reportTitle'), t('partner.reportMsg'), [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('partner.reportSubmit'),
                  onPress: () =>
                    showAlert(t('partner.submitted'), t('partner.submittedMsg')),
                },
              ])
            }
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.payBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.payLabel}>{t('partner.payWith')}</Text>
          <Text style={styles.payEst}>
            {t('partner.balance', { amount: formatDZD(wallet.balanceDZD) })}
          </Text>
        </View>
        <Button
          label={t('quick.scanPay')}
          fullWidth={false}
          onPress={() => router.push('/pay')}
          leftIcon={<MaterialIcons name="qr-code-scanner" size={18} color={colors.textInverse} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  notFoundTitle: { ...typography.h2, color: colors.text },
  cover: {
    width: '100%',
    height: 280,
    backgroundColor: colors.surfaceAlt,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    ...shadows.card,
  },
  verified: {
    position: 'absolute',
    left: spacing.base,
    bottom: spacing.base,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 4,
  },
  verifiedText: {
    ...typography.small,
    color: colors.textInverse,
    marginLeft: 4,
    fontWeight: '600',
  },
  body: {
    padding: spacing.base,
    gap: 12,
  },
  name: { ...typography.displayMd, color: colors.text },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    gap: 4,
    marginRight: 6,
  },
  metaText: { ...typography.small, color: colors.textSubtle, marginLeft: 4, fontWeight: '600' },
  desc: { ...typography.body, color: colors.textSubtle, lineHeight: 22 },
  priceBlock: {
    marginTop: spacing.sm,
    padding: spacing.base,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { ...typography.small, color: colors.textSubtle },
  priceAmount: { ...typography.h1, color: colors.text, marginTop: 2 },
  priceEst: { ...typography.caption, color: colors.emphasis, fontWeight: '600', marginTop: 2 },
  levels: { flexDirection: 'row' },
  section: { ...typography.h2, color: colors.text, marginTop: spacing.lg },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight + '25',
    borderRadius: radii.pill,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { ...typography.small, color: colors.primary, fontWeight: '600' },
  starsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  payBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  payLabel: { ...typography.bodyMedium, color: colors.text },
  payEst: { ...typography.small, color: colors.textSubtle, marginTop: 2 },
});
