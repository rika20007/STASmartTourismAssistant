import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme';
import { partnerCategories, PartnerCategory } from '@/services/mockPartners';
import { useLocale } from '@/hooks/useLocale';

interface CategoryBarProps {
  value: PartnerCategory | 'all';
  onChange: (key: PartnerCategory | 'all') => void;
}

export function CategoryBar({ value, onChange }: CategoryBarProps) {
  const { t } = useLocale();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {partnerCategories.map((c) => {
          const active = value === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => onChange(c.key)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <MaterialIcons
                name={c.icon as any}
                size={16}
                color={active ? colors.textInverse : colors.textSubtle}
              />
              <Text style={[styles.text, active && styles.textActive]}>
                {t(c.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 52,
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.caption,
    color: colors.textSubtle,
    marginLeft: 4,
  },
  textActive: { color: colors.textInverse, fontWeight: '600' },
});
