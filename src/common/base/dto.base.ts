import { plainToClass } from 'class-transformer';

export class BaseDTO {
  static plainToClass<T>(this: new (...args: any[]) => T, plain: T): T {
    return plainToClass(this, plain, { excludeExtraneousValues: true });
  }
}
