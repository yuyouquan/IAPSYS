import { flowHandlers } from './flowHandlers';
import { appHandlers } from './appHandlers';
import { todoHandlers } from './todoHandlers';
import { nodeHandlers } from './nodeHandlers';

export const handlers = [
  ...flowHandlers,
  ...appHandlers,
  ...todoHandlers,
  ...nodeHandlers,
];
