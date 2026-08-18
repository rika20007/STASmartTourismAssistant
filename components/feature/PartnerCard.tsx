import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { formatDZD, estimateLabel, Currency } from '@/services/currency';
import { Partner } from '@/services/mockPartners';
import { useLocale } from '@/hooks/useLocale';

interface PartnerCardProps {
  partner: Partner;
  currency: Currency;
  onPress?: () => void;
  compact?: boolean;
}

export function PartnerCard({ partner, currency, onPress, compact }: PartnerCardProps) {
  const { t } = useLocale();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        { opacity: pressed ? 0.92 : 1, width: compact ? 240 : '100%' },
      ]}
    >
      <Image
        source={{ uri: partner.cover }}
        style={[styles.image, compact && { height: 120 }]}
        contentFit="cover"
        transition={200}
      />
      {partner.verified ? (
        <View style={styles.verified}>
          <MaterialIcons name="verified" size={14} color={colors.textInverse} />
          <Text style={styles.verifiedText}>{t('partner.verified')}</Text>
        </View>
      ) : null}

      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <Text style={styles.name} numberOfLines={1}>
            {partner.name}
          </Text>
          <View style={styles.rating}>
            <MaterialIcons name="star" size={14} color={colors.emphasis} />
            <Text style={styles.ratingText}>{partner.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {partner.neighborhood} · {partner.city} · {partner.distanceKm.toFixed(1)} km
        </Text>
        {!compact ? (
          <Text style={styles.desc} numberOfLines={2}>
            {partner.description}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>{t('partner.avgSpend')}</Text>
            <Text style={styles.priceDZD}>{formatDZD(partner.averageDZD)}</Text>
            <Text style={styles.priceEst}>{estimateLabel(partner.averageDZD, currency)}</Text>
          </View>
          {partner.acceptsWallet ? (
            <View style={styles.walletPill}>
              <MaterialIcons name="qr-code-scanner" size={14} color={colors.primary} />
              <Text style={styles.walletPillText}>{t('partner.wallet')}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 160, backgroundColor: colors.surfaceAlt },
  verified: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    ...typography.small,
    color: colors.textInverse,
    marginLeft: 4,
  },
  body: { padding: spacing.base, gap: 6 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { ...typography.h3, color: colors.text, flex: 1, marginRight: 8 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { ...typography.caption, color: colors.text, marginLeft: 3 },
  location: { ...typography.caption, color: colors.textSubtle },
  desc: { ...typography.caption, color: colors.textSubtle, marginTop: 4 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priceLabel: { ...typography.small, color: colors.textMuted },
  priceDZD: { ...typography.bodyMedium, color: colors.text },
  priceEst: { ...typography.small, color: colors.emphasis, fontWeight: '600' },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    gap: 4,
  },
  walletPillText: {
    ...typography.small,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
