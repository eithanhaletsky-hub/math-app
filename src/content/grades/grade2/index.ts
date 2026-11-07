import type { Topic } from '../../types';
import { numbers1000Topic } from './numbers1000';
import { regroupTopic } from './regroup';
import { verticalTopic } from './vertical';
import { multiplyTopic } from './multiply';
import { divideTopic } from './divide';
import { moneyTopic } from './money';
import { timeTopic } from './time';
import { halvesTopic } from './halves';
import { geometryTopic } from './geometry';
import { measureTopic } from './measure';
import { storiesTopic } from './stories';

/** Grade 2 topics, in teaching order. */
export const grade2Topics: Topic[] = [
  numbers1000Topic,
  regroupTopic,
  verticalTopic,
  multiplyTopic,
  divideTopic,
  moneyTopic,
  timeTopic,
  halvesTopic,
  geometryTopic,
  measureTopic,
  storiesTopic,
];
