import type { Topic } from '../../types';
import { numberOpsTopic } from './numberOps';
import { percentTopic } from './percent';
import { ratioTopic } from './ratio';
import { geometryTopic } from './geometry';
import { statisticsTopic } from './statistics';
import { orderTopic } from './order';
import { storiesTopic } from './stories';

/** Grade 6 topics, in teaching order. */
export const grade6Topics: Topic[] = [numberOpsTopic, percentTopic, ratioTopic, geometryTopic, statisticsTopic, orderTopic, storiesTopic];
