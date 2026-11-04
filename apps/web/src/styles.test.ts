import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Read from disk: Vitest's CSS pipeline would hand back an empty string for `styles.css?raw`.
const styles = readFileSync(join(import.meta.dirname, 'styles.css'), 'utf-8');

/** Reads `--color-<name>: #rrggbb;` from the stylesheet so the test follows the real tokens. */
function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`).exec(styles);
  if (!match) throw new Error(`Missing color token --color-${name}`);
  return match[1]!;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(token(foreground)), luminance(token(background))].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

describe('journal book color tokens', () => {
  it('defines every token from the plan', () => {
    const expected = {
      page: '#fbf5e6',
      leather: '#5a3825',
      'leather-dark': '#3b2316',
      emboss: '#ecd29c',
      gold: '#e2a62a',
      'gold-deep': '#85590a',
      'star-gray': '#857f77',
    };
    for (const [name, value] of Object.entries(expected)) {
      expect(token(name).toLowerCase()).toBe(value);
    }
  });

  describe.each([
    ['cocoa', 'page'],
    ['cocoa-soft', 'page'],
    ['cream', 'leather'],
    ['emboss', 'leather'],
    ['emboss', 'leather-dark'],
  ])('text %s on %s', (foreground, background) => {
    it('meets WCAG AA for text (>= 4.5:1)', () => {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe.each([
    ['gold-deep', 'page'],
    ['star-gray', 'page'],
    ['orange-deep', 'page'],
  ])('graphic %s on %s', (foreground, background) => {
    it('meets WCAG AA for graphics and controls (>= 3:1)', () => {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(3);
    });
  });
});
