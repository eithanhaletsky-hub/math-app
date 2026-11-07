import type { Question } from '../../content/types';
import { ChoiceExercise } from './ChoiceExercise';
import { InputExercise } from './InputExercise';
import { NumberLineExercise } from './NumberLineExercise';
import { MatchExercise } from './MatchExercise';
import { FractionExercise } from './FractionExercise';
import { ClockExercise } from './ClockExercise';

interface Props {
  q: Question;
  locked: boolean;
  reveal: boolean;
  onSubmit: (correct: boolean) => void;
}

export function ExerciseView({ q, ...rest }: Props) {
  switch (q.kind) {
    case 'choice':
      return <ChoiceExercise q={q} {...rest} />;
    case 'input':
      return <InputExercise q={q} {...rest} />;
    case 'numberline':
      return <NumberLineExercise q={q} {...rest} />;
    case 'match':
      return <MatchExercise q={q} {...rest} />;
    case 'fraction':
      return <FractionExercise q={q} {...rest} />;
    case 'clock':
      return <ClockExercise q={q} {...rest} />;
  }
}
