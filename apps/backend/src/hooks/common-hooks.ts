import { exo } from '@exobase/core';
import { useLambda } from '@exobase/use-lambda';

import { useErrorMapping } from './use-error-mapping';

export const vessel = () => exo().root(useLambda()).hook(useErrorMapping);
