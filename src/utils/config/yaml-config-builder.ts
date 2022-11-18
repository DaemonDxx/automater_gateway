import { readFileSync } from 'fs';
import Joi from 'joi';
import * as yaml from 'js-yaml';
import { filter, from, map, take, throwIfEmpty } from 'rxjs';

const filterNotNull = (data) => data !== null;

const loadYamlFile = (path: string) => {
  const file = readFileSync(path, { encoding: 'utf-8' });
  return yaml.load(file) as Record<string, any>;
};

const loadConfiguration = (paths: string[]) =>
  from(paths).pipe(
    map((path) => {
      try {
        return loadYamlFile(path);
      } catch (e) {
        return null;
      }
    }),
    filter(filterNotNull),
    take(1),
    throwIfEmpty(() => new Error('Not found config file by paths')),
  );

const yamlConfigBuilder =
  (paths: string[], validation?: Joi.ObjectSchema) => () =>
    new Promise((resolve, reject) => {
      loadConfiguration(paths)
        .pipe(
          map((value) => {
            if (!validation) return value;
            const result = validation.validate(value);
            if (result.error)
              throw new Error(
                `Validation config file error: ${result.error.message}`,
              );
            return result.value;
          }),
        )
        .subscribe(
          (v) => resolve(v),
          (err) => reject(err),
        );
    });

export class YamlConfigLoaderBuilder {
  private readonly paths: string[] = [];
  private validator: Joi.ObjectSchema | undefined;

  addPath(path: string) {
    this.paths.push(path);
    return this;
  }

  setValidation(validator: Joi.ObjectSchema) {
    this.validator = validator;
    return this;
  }

  build(): () => Promise<Record<string, any>> {
    return yamlConfigBuilder(this.paths, this.validator);
  }
}
