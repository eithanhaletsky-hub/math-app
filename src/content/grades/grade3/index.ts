import type { Topic } from '../../types';
import { numbers10kTopic } from './numbers10k';
import { tableTopic } from './table';
import { multiplyBigTopic } from './multiplyBig';
import { divisionTopic } from './division';
import { orderTopic } from './order';
import { fractionsTopic } from './fractions';
import { geometryTopic } from './geometry';
import { measureTopic } from './measure';
import { storiesTopic } from './stories';

/** Grade 3 topics, in teaching order. */
export const grade3Topics: Topic[] = [
  numbers10kTopic,
  tableTopic,
  multiplyBigTopic,
  divisionTopic,
  orderTopic,
  fractionsTopic,
  geometryTopic,
  measureTopic,
  storiesTopic,
];
