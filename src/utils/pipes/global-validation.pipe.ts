import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { IS_SKIP_GLOBAL_VALIDATION } from '../decorators/disable-global-validation.decorator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const isSkip = Reflect.getMetadata(
      IS_SKIP_GLOBAL_VALIDATION,
      metadata.metatype,
    );
    if (isSkip) return value;
    return super.transform(value, metadata);
  }
}
