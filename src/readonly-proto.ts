import { propertyDecoratorOnly } from './errors';

/**
 * Lazy set a fixed/shared value on the prototype so it is not created for each instance of the
 * class.
 *
 * The value is retrieved from an initializer function, which is invoked once per Class.
 *
 * Notes:
 *   - The function is invoked once per class, not per instance.
 *   - ES7 Property initializer is not supported.
 *   - The property descriptor is a non-enumerable, non-configurable getter.
 *
 * @param fn A function that returns the value
 */
export function ReadonlyProto(fn: Function, lazy: true): PropertyDecorator;

/**
 * Sets a fixed/shared value on the prototype so it is not created for each instance of the
 * class.
 *
 * Notes:
 *   - ES7 Property initializer is not supported.
 *   - The property descriptor is a non-writable value.
 * @param value
 */
export function ReadonlyProto(value: any): PropertyDecorator;
export function ReadonlyProto(value: any, lazy?: true): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor?: any) => {
    if (descriptor) {
      throw propertyDecoratorOnly('ReadonlyProto');
    }

    if (lazy === true) {
      return {
        get: function() {
          if (lazy && this !== target) {
            value = value();
            lazy = undefined;
          }
          return value;
        }
      }
    } else {
      return { value };
    }
  };
}
