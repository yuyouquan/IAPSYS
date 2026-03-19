import { flowHandlers } from './flowHandlers';
import { appHandlers } from './appHandlers';
import { todoHandlers } from './todoHandlers';
import { nodeHandlers } from './nodeHandlers';
import { notificationHandlers } from './notificationHandlers';

export const handlers = [
  ...flowHandlers,
  ...appHandlers,
  ...todoHandlers,
  ...nodeHandlers,
  ...notificationHandlers,
];
