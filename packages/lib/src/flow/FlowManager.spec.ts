import { expectTypeOf } from 'vitest';

import type { FlowStep, IFlowManager } from './namespace';

import FlowManager, { createFlowManager, createFlowManagerFromType, flowEndStatus } from './index';

describe('Flow Manager', () => {
  const flowManager = new FlowManager(['date', 'time']);
  const addDiversion = (name: FlowStep) => { flowManager.diversion(name); };
  const emptyManager = () => (new FlowManager([]));

  it('Create Flow Manager', () => {
    expectTypeOf(flowManager).toEqualTypeOf<FlowManager>();
    expectTypeOf(flowManager).toMatchTypeOf<IFlowManager>();
    expectTypeOf(new FlowManager([])).toEqualTypeOf<FlowManager>();
  });

  it('Flow Manager First', () => {
    expect(flowManager.first()).toBe('date');
    expect(emptyManager().first()).toBe(flowEndStatus);
    expect(emptyManager().first()).toBe(flowEndStatus);
  });

  it('Flow Manager Step', () => {
    expect(flowManager.step(-1)).toBe(flowEndStatus);
    expect(flowManager.step(0)).toBe('date');
    expect(flowManager.step(1)).toBe('time');
    expect(flowManager.step(2)).toBe(flowEndStatus);
  });

  it('Flow Manager Next', () => {
    expect(flowManager.next('date')).toBe('time');
    expect(flowManager.next('time')).toBe(flowEndStatus);
    // @ts-ignore
    expect(flowManager.next(flowEndStatus)).toBe('date');
    // @ts-ignore
    expect(flowManager.next('somethingcomepletlybogus')).toBe('date');

    expect(emptyManager().next('date')).toBe(flowEndStatus);
    // @ts-ignore
    expect(emptyManager().next('somethingcomepletlybogus')).toBe(flowEndStatus);
  });

  it('Flow Manager Diversion', () => {
    // @ts-ignore
    addDiversion('test');
    expect(flowManager.next('date')).toBe('test');
    expect(flowManager.next('date')).toBe('time');

    const manager = emptyManager();
    // @ts-ignore
    manager.diversion('test');
    expect(manager.next('date')).toBe('test');
    expect(manager.next('date')).toBe(flowEndStatus);
  });
});

describe('Flow Manager Factory Functions', () => {
  it('Create Flow Manager', () => {
    const manager = createFlowManager(['date', 'time']);
    expect(manager.step(0)).toBe('date');
    expect(manager.step(1)).toBe('time');
    expect(manager.step(2)).toBe(flowEndStatus);
  });

  it('Create Flow Manager From Flow Type', () => {
    let manager = createFlowManagerFromType('datetime');
    expect(manager.step(0)).toBe('date');
    expect(manager.step(1)).toBe('time');
    expect(manager.step(2)).toBe(flowEndStatus);

    manager = createFlowManagerFromType('date');
    expect(manager.step(0)).toBe('date');
    expect(manager.step(2)).toBe(flowEndStatus);

    manager = createFlowManagerFromType('time');
    expect(manager.step(0)).toBe('time');
    expect(manager.step(2)).toBe(flowEndStatus);

    // @ts-ignore
    expect(() => createFlowManagerFromType('sometotallybogustype')).toThrow(TypeError);
  });
});
