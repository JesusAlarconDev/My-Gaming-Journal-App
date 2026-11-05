import {
  BOOK_COMPACT_MAX_WIDTH,
  BOOK_SPREAD_MIN_WIDTH,
  announcementLabel,
  canStepCapture,
  isCompactWidth,
  stepCapture,
  START_POSITION,
  canGoNext,
  canGoPrevious,
  captureSlots,
  clampPosition,
  layoutForWidth,
  nextPosition,
  positionLabel,
  previousPosition,
  starOffsets,
  type BookPosition,
} from './book';

const at = (entryIndex: number, side: BookPosition['side'] = 'first'): BookPosition => ({
  entryIndex,
  side,
});

describe('layoutForWidth', () => {
  it('shows a spread from the minimum width and a single page below it', () => {
    expect(layoutForWidth(BOOK_SPREAD_MIN_WIDTH)).toBe('spread');
    expect(layoutForWidth(BOOK_SPREAD_MIN_WIDTH - 1)).toBe('single');
    expect(layoutForWidth(360)).toBe('single');
    expect(layoutForWidth(1280)).toBe('spread');
  });
});

describe('spread navigation (one step = one entry)', () => {
  it('moves entry by entry and stops at the ends', () => {
    expect(nextPosition(at(0), 'spread', 3)).toEqual(at(1));
    expect(nextPosition(at(1), 'spread', 3)).toEqual(at(2));
    expect(nextPosition(at(2), 'spread', 3)).toEqual(at(2));
    expect(previousPosition(at(2), 'spread', 3)).toEqual(at(1));
    expect(previousPosition(at(0), 'spread', 3)).toEqual(at(0));
  });

  it('reports the ends through canGoNext and canGoPrevious', () => {
    expect(canGoPrevious(at(0), 'spread', 3)).toBe(false);
    expect(canGoNext(at(0), 'spread', 3)).toBe(true);
    expect(canGoPrevious(at(2), 'spread', 3)).toBe(true);
    expect(canGoNext(at(2), 'spread', 3)).toBe(false);
  });
});

describe('single navigation (one step = one page)', () => {
  it('goes first page, second page, then the next entry', () => {
    expect(nextPosition(at(0), 'single', 2)).toEqual(at(0, 'second'));
    expect(nextPosition(at(0, 'second'), 'single', 2)).toEqual(at(1));
    expect(nextPosition(at(1), 'single', 2)).toEqual(at(1, 'second'));
  });

  it('stops after the last page of the last entry', () => {
    const last = at(1, 'second');
    expect(canGoNext(last, 'single', 2)).toBe(false);
    expect(nextPosition(last, 'single', 2)).toBe(last);
  });

  it('goes back through the pages, landing on the second page of the previous entry', () => {
    expect(previousPosition(at(1), 'single', 2)).toEqual(at(0, 'second'));
    expect(previousPosition(at(0, 'second'), 'single', 2)).toEqual(at(0));
  });

  it('stops before the first page of the first entry', () => {
    const first = at(0);
    expect(canGoPrevious(first, 'single', 2)).toBe(false);
    expect(previousPosition(first, 'single', 2)).toBe(first);
  });

  it('walks the whole book forwards and back again, visiting every page once', () => {
    const forward: BookPosition[] = [at(0)];
    while (canGoNext(forward.at(-1)!, 'single', 3)) {
      forward.push(nextPosition(forward.at(-1)!, 'single', 3));
    }
    expect(forward).toHaveLength(6);

    const backward: BookPosition[] = [forward.at(-1)!];
    while (canGoPrevious(backward.at(-1)!, 'single', 3)) {
      backward.push(previousPosition(backward.at(-1)!, 'single', 3));
    }
    expect(backward.reverse()).toEqual(forward);
  });
});

describe('edge cases with 0 and 1 entries', () => {
  it('cannot move with no entries', () => {
    for (const layout of ['spread', 'single'] as const) {
      expect(canGoNext(START_POSITION, layout, 0)).toBe(false);
      expect(canGoPrevious(START_POSITION, layout, 0)).toBe(false);
      expect(nextPosition(START_POSITION, layout, 0)).toBe(START_POSITION);
    }
  });

  it('cannot move between entries with one entry in a spread', () => {
    expect(canGoNext(at(0), 'spread', 1)).toBe(false);
    expect(canGoPrevious(at(0), 'spread', 1)).toBe(false);
  });

  it('can still turn between the two pages of the only entry in single', () => {
    expect(canGoNext(at(0), 'single', 1)).toBe(true);
    expect(nextPosition(at(0), 'single', 1)).toEqual(at(0, 'second'));
    expect(canGoNext(at(0, 'second'), 'single', 1)).toBe(false);
    expect(canGoPrevious(at(0, 'second'), 'single', 1)).toBe(true);
  });
});

describe('clampPosition', () => {
  it('keeps a valid position', () => {
    expect(clampPosition(at(2, 'second'), 5)).toEqual(at(2, 'second'));
  });

  it('pulls the position back inside the book when entries disappear', () => {
    expect(clampPosition(at(5), 3)).toEqual(at(2));
    expect(clampPosition(at(-1), 3)).toEqual(at(0));
  });

  it('returns the start position for an empty book', () => {
    expect(clampPosition(at(4, 'second'), 0)).toEqual(START_POSITION);
  });
});

describe('changing layout keeps the current entry', () => {
  it('uses the same entry whichever layout renders it', () => {
    const position = at(3, 'second');
    expect(clampPosition(position, 6).entryIndex).toBe(3);
    expect(nextPosition(at(3), 'spread', 6).entryIndex).toBe(4);
    expect(nextPosition(at(3), 'single', 6).entryIndex).toBe(3);
  });
});

describe('positionLabel', () => {
  it('labels the entry in a spread', () => {
    expect(positionLabel(at(1), 'spread', 6)).toBe('Entrada 2 de 6');
    expect(positionLabel(at(1, 'second'), 'spread', 6)).toBe('Entrada 2 de 6');
  });

  it('adds the page in single', () => {
    expect(positionLabel(at(0), 'single', 6)).toBe('Entrada 1 de 6 · Página 1 de 2');
    expect(positionLabel(at(5, 'second'), 'single', 6)).toBe('Entrada 6 de 6 · Página 2 de 2');
  });

  it('is empty when there are no entries', () => {
    expect(positionLabel(START_POSITION, 'spread', 0)).toBe('');
  });
});

describe('announcementLabel', () => {
  it('announces the entry and its game in a spread', () => {
    expect(announcementLabel(at(1), 'spread', 6, 'Hades')).toBe('Entrada 2 de 6: Hades');
  });

  it('adds the page in single', () => {
    expect(announcementLabel(at(1), 'single', 6, 'Hades')).toBe(
      'Entrada 2 de 6, página 1 de 2: Hades',
    );
    expect(announcementLabel(at(1, 'second'), 'single', 6, 'Hades')).toBe(
      'Entrada 2 de 6, página 2 de 2: Hades',
    );
  });
});

describe('captureSlots', () => {
  it('always returns three slots', () => {
    expect(captureSlots([])).toEqual([undefined, undefined, undefined]);
    expect(captureSlots(['a'])).toEqual(['a', undefined, undefined]);
    expect(captureSlots(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('ignores images beyond the third', () => {
    expect(captureSlots(['a', 'b', 'c', 'd', 'e'])).toEqual(['a', 'b', 'c']);
  });
});

describe('isCompactWidth', () => {
  it('is compact at 550 px and below, not above', () => {
    expect(isCompactWidth(BOOK_COMPACT_MAX_WIDTH)).toBe(true);
    expect(isCompactWidth(550)).toBe(true);
    expect(isCompactWidth(551)).toBe(false);
    expect(isCompactWidth(360)).toBe(true);
    expect(isCompactWidth(0)).toBe(true);
  });

  it('is always narrower than the spread layout threshold', () => {
    expect(BOOK_COMPACT_MAX_WIDTH).toBeLessThan(BOOK_SPREAD_MIN_WIDTH);
  });
});

describe('stepCapture', () => {
  it('moves one capture at a time in both directions', () => {
    expect(stepCapture(0, 'next')).toBe(1);
    expect(stepCapture(1, 'next')).toBe(2);
    expect(stepCapture(2, 'previous')).toBe(1);
    expect(stepCapture(1, 'previous')).toBe(0);
  });

  it('stops at the ends instead of wrapping around', () => {
    expect(stepCapture(2, 'next')).toBe(2);
    expect(stepCapture(0, 'previous')).toBe(0);
  });

  it('reports the ends through canStepCapture', () => {
    expect(canStepCapture(0, 'previous')).toBe(false);
    expect(canStepCapture(0, 'next')).toBe(true);
    expect(canStepCapture(1, 'previous')).toBe(true);
    expect(canStepCapture(1, 'next')).toBe(true);
    expect(canStepCapture(2, 'previous')).toBe(true);
    expect(canStepCapture(2, 'next')).toBe(false);
  });

  it('pulls an out-of-range index back inside the three captures', () => {
    expect(stepCapture(7, 'next')).toBe(2);
    expect(stepCapture(7, 'previous')).toBe(1);
    expect(stepCapture(-3, 'previous')).toBe(0);
    expect(stepCapture(-3, 'next')).toBe(1);
  });

  it('visits the three captures once each, going forward and back', () => {
    let index = 0;
    const forward = [index];
    while (canStepCapture(index, 'next')) forward.push((index = stepCapture(index, 'next')));
    expect(forward).toEqual([0, 1, 2]);
    const back = [index];
    while (canStepCapture(index, 'previous')) back.push((index = stepCapture(index, 'previous')));
    expect(back).toEqual([2, 1, 0]);
  });
});

describe('starOffsets', () => {
  it('has one offset per star', () => {
    expect(starOffsets).toHaveLength(5);
  });

  it('alternates up and down: 1st high, 2nd low, 3rd high...', () => {
    starOffsets.forEach((offset, index) => {
      if (index % 2 === 0) expect(offset.y).toBeLessThan(0);
      else expect(offset.y).toBeGreaterThan(0);
    });
  });

  it('varies the position and tilt so the stars do not look mechanical', () => {
    expect(new Set(starOffsets.map((o) => o.y)).size).toBeGreaterThan(3);
    expect(new Set(starOffsets.map((o) => o.rotate)).size).toBe(5);
  });
});
