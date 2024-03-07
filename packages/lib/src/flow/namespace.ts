export type FlowType = 'datetime' | 'date' | 'time';

export type FlowStep = 'date' | 'time' | 'year' | 'month';

export type EndStatus = 'end';

export type StepType = FlowStep | EndStatus;

export interface IFlowManager {
  step(index: number): StepType;
  first(): StepType;
  next(current: StepType): StepType;
  diversion(next: string): void;
}
