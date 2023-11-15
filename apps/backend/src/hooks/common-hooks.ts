import { exo } from '@exobase/core';
import { useLambda } from '@exobase/use-lambda';

export const vessel = () => exo().root(useLambda());
