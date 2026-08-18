/**
 * Mocked AI Tourism Assistant.
 * Produces structured, concierge-style replies without a live model.
 * Trilingual: English / French / Arabic.
 */

import { partners } from './mockPartners';
import { Locale, translate } from './i18n';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  createdAt: number;
}

type Intent = 'food' | 'itin' | 'wallet' | 'safe' | 'hotel' | 'default';

function detectIntent(input: string): Intent {
  const text = input.toLowerCase();
  if (
    /(eat|food|restaurant|dinner|lunch|manger|repas|nourriture|resto|dîner|déjeuner|مطعم|أكل|طعام|آكل|وجبة|عشاء|غداء)/.test(
      text
    )
  )
    return 'food';
  if (
    /(itinerary|itin|day|trip|plan|itinéraire|jour|voyage|programme|séjour|رحلة|خطة|أيام|يوم|برنامج|جولة)/.test(
      text
    )
  )
    return 'itin';
  if (
    /(wallet|pay|money|top ?up|portefeuille|payer|argent|paiement|recharge|محفظة|دفع|نقود|شحن|أموال)/.test(
      text
    )
  )
    return 'wallet';
  if (
    /(safe|safety|emergency|police|sûr|sécurité|urgence|أمان|طوارئ|سلامة|آمن|شرطة)/.test(
      text
    )
  )
    return 'safe';
  if (
    /(hotel|stay|sleep|room|hôtel|dormir|hébergement|chambre|فندق|مبيت|إقامة|النوم|فنادق|غرفة)/.test(
      text
    )
  )
    return 'hotel';
  return 'default';
}

function pickPartner(category: string) {
  return partners.find((p) => p.category === category) ?? partners[0];
}

function reply(userText: string, locale: Locale): AiMessage {
  const intent = detectIntent(userText);
  const tr = (k: string, v?: Record<string, string | number>) => translate(locale, k, v);
  let content = '';
  let suggestions: string[] = [];

  if (intent === 'food') {
    const p = pickPartner('restaurant');
    content = tr('ai.reply.food', {
      name: p.name,
      area: p.neighborhood,
      city: p.city,
      rating: p.rating,
      count: p.ratingCount,
      avg: p.averageDZD.toLocaleString(),
    });
    suggestions = [tr('ai.reply.food.s1'), tr('ai.reply.food.s2'), tr('ai.reply.food.s3')];
  } else if (intent === 'itin') {
    content = tr('ai.reply.itin');
    suggestions = [tr('ai.reply.itin.s1'), tr('ai.reply.itin.s2'), tr('ai.reply.itin.s3')];
  } else if (intent === 'wallet') {
    content = tr('ai.reply.wallet');
    suggestions = [
      tr('ai.reply.wallet.s1'),
      tr('ai.reply.wallet.s2'),
      tr('ai.reply.wallet.s3'),
    ];
  } else if (intent === 'safe') {
    content = tr('ai.reply.safe');
    suggestions = [tr('ai.reply.safe.s1'), tr('ai.reply.safe.s2'), tr('ai.reply.safe.s3')];
  } else if (intent === 'hotel') {
    const p = pickPartner('hotel');
    content = tr('ai.reply.hotel', {
      name: p.name,
      rating: p.rating,
      count: p.ratingCount,
      avg: p.averageDZD.toLocaleString(),
    });
    suggestions = [
      tr('ai.reply.hotel.s1'),
      tr('ai.reply.hotel.s2'),
      tr('ai.reply.hotel.s3'),
    ];
  } else {
    content = tr('ai.reply.default');
    suggestions = initialSuggestions(locale);
  }

  return {
    id: `m_${Date.now()}_a`,
    role: 'assistant',
    content,
    suggestions,
    createdAt: Date.now(),
  };
}

export function respondTo(userText: string, locale: Locale = 'en'): Promise<AiMessage> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(reply(userText, locale)), 550);
  });
}

export function initialSuggestions(locale: Locale = 'en'): string[] {
  return [
    translate(locale, 'ai.sug.eat'),
    translate(locale, 'ai.sug.itinerary'),
    translate(locale, 'ai.sug.wallet'),
    translate(locale, 'ai.sug.safe'),
  ];
}

export function welcomeMessage(locale: Locale = 'en'): AiMessage {
  return {
    id: 'm_welcome',
    role: 'assistant',
    content: translate(locale, 'ai.welcome'),
    suggestions: initialSuggestions(locale),
    createdAt: Date.now(),
  };
}
