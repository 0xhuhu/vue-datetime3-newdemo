import FlowManager, { dateFlow, dateTimeFlow, flowEndStatus, timeFlow } from './FlowManager';
import { FlowStep, FlowType, IFlowManager } from './namespace';

export const createFlowManager = (flow: FlowStep[]): IFlowManager => (new FlowManager(flow));

export const createFlowManagerFromType = (type: FlowType): IFlowManager => {
  switch (type) {
  case 'datetime':
    return new FlowManager(dateTimeFlow);
  case 'date':
    return new FlowManager(dateFlow);
  case 'time':
    return new FlowManager(timeFlow);
  default:
    throw new TypeError(`Cannot create flow type of ${type}`);
  }
};

export { flowEndStatus };

export default FlowManager;
