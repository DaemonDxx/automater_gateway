import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_GLOBAL_VALIDATION = 'IS_SKIP_GLOBAL_VALIDATION';

export const DisableGlobalValidationPipe = () => {
  return SetMetadata(IS_SKIP_GLOBAL_VALIDATION, true);
};
