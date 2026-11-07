import type { Question } from '../../content/types';

export interface ExerciseProps<K extends Question['kind']> {
  q: Extract<Question, { kind: K }>;
  /** No more input allowed (answered correctly or out of tries). */
  locked: boolean;
  /** Show the correct answer (after the last wrong try). */
  reveal: boolean;
  onSubmit: (correct: boolean) => void;
}
