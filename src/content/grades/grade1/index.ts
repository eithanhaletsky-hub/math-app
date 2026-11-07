import type { Topic } from '../../types';
import { countTopic } from './count';
import { bondsTopic } from './bonds';
import { add10Topic } from './add10';
import { clockTopic } from './clock';
import { shapesTopic } from './shapes';

/** Grade 1 topics, in the order they are taught. */
export const grade1Topics: Topic[] = [countTopic, bondsTopic, add10Topic, shapesTopic, clockTopic];
