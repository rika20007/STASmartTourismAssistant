import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography, shadows } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';
import { AiMessage, initialSuggestions, respondTo, welcomeMessage } from '@/services/ai';
import { useLocale } from '@/hooks/useLocale';

export default function AssistantScreen() {
  const { t, locale, isRTL } = useLocale();
  const [messages, setMessages] = useState<AiMessage[]>([welcomeMessage(locale)]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<FlatList<AiMessage>>(null);

  // Retranslate welcome when locale changes and no user interaction yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'm_welcome') {
        return [welcomeMessage(locale)];
      }
      return prev;
    });
  }, [locale]);

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || thinking) return;
      const userMsg: AiMessage = {
        id: `m_${Date.now()}_u`,
        role: 'user',
        content,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setThinking(true);
      const reply = await respondTo(content, locale);
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    },
    [input, thinking, locale]
  );

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages]);

  const latestSuggestions =
    [...messages].reverse().find((m) => m.role === 'assistant')?.suggestions ??
    initialSuggestions(locale);

  const rtlText = isRTL
    ? { textAlign: 'right' as const, writingDirection: 'rtl' as const }
    : undefined;

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <MaterialIcons name="auto-awesome" size={20} color={colors.emphasis} />
            </View>
            <View>
              <Text style={styles.brandTitle}>{t('ai.title')}</Text>
              <Text style={styles.brandSub}>{t('ai.sub')}</Text>
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{t('ai.online')}</Text>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messages}
          renderItem={({ item }) => <MessageBubble msg={item} rtlText={rtlText} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListFooterComponent={
            thinking ? (
              <View style={[styles.bubble, styles.assistant]}>
                <Text style={styles.assistantText}>{t('ai.composing')}</Text>
              </View>
            ) : null
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestions}
        >
          {latestSuggestions.map((s) => (
            <Pressable
              key={s}
              onPress={() => send(s)}
              style={({ pressed }) => [
                styles.suggestion,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t('ai.placeholder')}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, rtlText]}
            multiline
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send()}
            disabled={!input.trim() || thinking}
            style={({ pressed }) => [
              styles.sendBtn,
              { opacity: !input.trim() || thinking ? 0.5 : pressed ? 0.85 : 1 },
            ]}
          >
            <MaterialIcons name="send" size={20} color={colors.textInverse} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({
  msg,
  rtlText,
}: {
  msg: AiMessage;
  rtlText?: { textAlign: 'right'; writingDirection: 'rtl' };
}) {
  const isUser = msg.role === 'user';
  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.user : styles.assistant,
        { alignSelf: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      <Text style={[isUser ? styles.userText : styles.assistantText, rtlText]}>
        {msg.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.emphasisLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: { ...typography.h2, color: colors.text },
  brandSub: { ...typography.small, color: colors.textSubtle, marginTop: 2 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: { ...typography.small, color: colors.success, fontWeight: '600' },
  messages: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: 8,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    borderRadius: radii.lg,
  },
  user: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistant: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  userText: { ...typography.body, color: colors.textInverse },
  assistantText: { ...typography.body, color: colors.text },
  suggestions: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  suggestionText: { ...typography.small, color: colors.primary, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
