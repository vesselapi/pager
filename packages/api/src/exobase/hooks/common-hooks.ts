import { exo } from '@exobase/core';

import { useErrorMapping } from './use-error-mapping';
import { useLambda } from './use-lambda';

export const vessel = () => exo().root(useLambda()).hook(useErrorMapping());
