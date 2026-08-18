import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { usePartners } from '@/hooks/usePartners';
import { useWallet } from '@/hooks/useWallet';
import { useLocale } from '@/hooks/useLocale';
import { PartnerCard } from '@/components/feature/PartnerCard';
import { CategoryBar } from '@/components/feature/CategoryBar';

export default function PartnersScreen() {
  const router = useRouter();
  const wallet = useWallet();
  const { t, isRTL } = useLocale();
  const { query, setQuery, filter, setFilter, partners: filtered, total } = usePartners();

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  const header = useMemo(
    () => (
      <View>
        <View style={styles.top}>
          <Text style={[styles.title, rtlText]}>{t('partners.title')}</Text>
          <Text style={[styles.subtitle, rtlText]}>
            {t('partners.subtitle', { count: total })}
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, rtlText]}
            placeholder={t('partners.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <CategoryBar value={filter} onChange={setFilter} />
      </View>
    ),
    [query, setQuery, filter, setFilter, total, t, rtlText]
  );

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="travel-explore" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('partners.empty.title')}</Text>
            <Text style={styles.emptyText}>{t('partners.empty.desc')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PartnerCard
            partner={item}
            currency={wallet.preferredCurrency}
            onPress={() => router.push(`/partner/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: spacing.base, paddingTop: spacing.sm },
  title: { ...typography.displayMd, color: colors.text },
  subtitle: { ...typography.caption, color: colors.textSubtle, marginTop: 4 },
  searchWrap: {
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: 4,
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: spacing.base,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: { ...typography.h2, color: colors.text, marginTop: 8 },
  emptyText: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
