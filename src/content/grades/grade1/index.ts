import type { Topic } from '../../types';
import { countTopic } from './count';
import { bondsTopic } from './bonds';
import { add10Topic } from './add10';
import { add20Topic } from './add20';
import { hundredTopic } from './hundred';
import { compareTopic } from './compare';
import { add100Topic } from './add100';
import { patternsTopic } from './patterns';
import { shapesTopic } from './shapes';
import { lengthTopic } from './length';
import { clockTopic } from './clock';
import { storiesTopic } from './stories';

/** Grade 1 topics, in the order they are taught (numbers → operations → geometry/measurement). */
export const grade1Topics: Topic[] = [
  countTopic,
  bondsTopic,
  add10Topic,
  add20Topic,
  hundredTopic,
  compareTopic,
  add100Topic,
  patternsTopic,
  shapesTopic,
  lengthTopic,
  clockTopic,
  storiesTopic,
];
