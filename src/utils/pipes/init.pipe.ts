import {
  ArgumentMetadata,
  DefaultValuePipe,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class InitPipe extends DefaultValuePipe implements PipeTransform {
  constructor(private readonly initValue) {
    super(initValue);
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    if (typeof this.initValue === 'object' && typeof value === 'object')
      return { ...this.initValue, ...value };
    else return super.transform(value, metadata);
  }
}
