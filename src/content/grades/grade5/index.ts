import type { Topic } from '../../types';
import { divisorsTopic } from './divisors';
import { fractionOpsTopic } from './fractionOps';
import { decimalsTopic } from './decimals';
import { geometryTopic } from './geometry';
import { graphsTopic } from './graphs';
import { storiesTopic } from './stories';

/** Grade 5 topics, in teaching order. */
export const grade5Topics: Topic[] = [divisorsTopic, fractionOpsTopic, decimalsTopic, geometryTopic, graphsTopic, storiesTopic];
