import { capitalize, pad } from './index';

describe('General Utils', () => {
  it('Capitalize', () => {
    const test = 'test';
    const capTest = 'Test';
    expect(capitalize(test)).toEqual(capTest);
  });

  it('Pad', () => {
    expect(pad(0)).toBe('00');
    expect(pad(2)).toBe('02');
    expect(pad(12)).toBe('12');
    expect(pad(20)).toBe('20');
  });
});
