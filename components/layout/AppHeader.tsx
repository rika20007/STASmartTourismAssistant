import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export function AppHeader({
  title,
  subtitle,
  showBack,
  right,
  variant = 'light',
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDark = variant === 'dark';

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: isDark ? colors.surfaceDark : 'transparent',
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable
              hitSlop={12}
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={isDark ? colors.textInverse : colors.text}
              />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.center}>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.textInverse : colors.text },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSubtle },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: { width: 48, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  title: { ...typography.h2 },
  subtitle: { ...typography.small, marginTop: 2 },
});
