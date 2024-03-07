import { expectTypeOf } from 'vitest';
import { createApp } from 'vue';

import createDatetime from './index';

describe('API testing', () => {
  it('Default export should return a plugin function', () => {
    const result = createDatetime();

    expect(result?.install).toBeDefined();
    expectTypeOf(result.install).toMatchTypeOf<Function>();
  });

  it('Check if plugin exposes all the right components', () => {
    const app = createApp({ template: '<div />' }).use(createDatetime());

    // eslint-disable-next-line no-underscore-dangle
    expect(Object.entries(app._context.components)).toHaveLength(2);
    // eslint-disable-next-line no-underscore-dangle
    expect(Object.keys(app._context.components)).toEqual(['DateTime', 'DateTimePopup']);
  });
});
