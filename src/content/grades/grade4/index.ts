import type { Topic } from '../../types';
import { bigNumbersTopic } from './bigNumbers';
import { multiplyTopic } from './multiply';
import { divisionTopic } from './division';
import { fractionsTopic } from './fractions';
import { geometryTopic } from './geometry';
import { storiesTopic } from './stories';

/** Grade 4 topics, in teaching order. */
export const grade4Topics: Topic[] = [bigNumbersTopic, multiplyTopic, divisionTopic, fractionsTopic, geometryTopic, storiesTopic];
