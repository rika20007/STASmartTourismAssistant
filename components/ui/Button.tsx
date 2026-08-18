import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors, radii, spacing, typography } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading,
  disabled,
  leftIcon,
}: ButtonProps) {
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.surfaceAlt
      : variant === 'danger'
      ? colors.danger
      : 'transparent';
  const fg =
    variant === 'primary' || variant === 'danger'
      ? colors.textInverse
      : variant === 'secondary'
      ? colors.text
      : colors.primary;
  const border = variant === 'ghost' ? colors.primary : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'ghost' ? 1 : 0,
          paddingVertical: size === 'lg' ? 16 : 13,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.base : spacing.lg,
        },
      ]}
      hitSlop={4}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
            <Text style={[styles.label, { color: fg, fontSize: size === 'lg' ? 17 : 15 }]}>
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.h3,
    fontWeight: '600',
  },
});
