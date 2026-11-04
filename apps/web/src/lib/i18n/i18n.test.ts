import { t } from './index';

describe('t', () => {
  it('translates a key', () => {
    expect(t('status.playing')).toBe('Jugando');
  });

  it('interpolates params', () => {
    expect(t('rating.label', { value: 3 })).toBe('3 de 5 estrellas');
  });

  it('keeps unknown placeholders untouched', () => {
    expect(t('rating.label')).toBe('{value} de 5 estrellas');
  });
});
