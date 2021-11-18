import { useLocales } from './useLocales';

export function useFaqs() {
  const t = useLocales();
  return [
    {
      title: t('how-to-login'),
      answer: t('answer-to-how-to-login'),
    },
    {
      title: t('how-to-install'),
      answer: t('answer-to-how-to-install'),
    },
    {
      title: t('what-is-an-nft'),
      answer: t('answer-what-is-an-nft'),
    },
    {
      title: t('how-to-purchase'),
      answer: t('answer-to-how-to-purchase'),
    },
    {
      title: t('what-is-the-purchase-mechanism'),
      answer: t('answer-to-what-is-the-purchase-mechanism'),
    },
    {
      title: t('why-it-cost'),
      answer: t('answer-to-why-it-cost'),
    },
    {
      title: t('how-to-check'),
      answer: t('answer-to-how-to-check'),
    },
    {
      title: t('how-to-sell'),
      answer: t('answer-to-how-to-sell'),
    },
    {
      title: t('what-is-the-platform'),
      answer: t('answer-to-what-is-the-platform'),
    },
    {
      title: t('how-to-contact'),
      answer: t('answer-to-how-to-contact'),
    },
    {
      title: t('is-contract-safe'),
      answer: t('answer-to-is-contract-safe'),
    },
    {
      title: t('what-is-the-network'),
      answer: t('answer-to-what-is-the-network'),
    },
  ];
}
