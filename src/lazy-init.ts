import { propertyDecoratorOnly } from './errors';

/**
 * Use an initializer to get a value and set it on the decorated property.
 *
 * This is a replacement for ES7 Property initializer, until TypeScript support is available.
 *
 * Notes:
 *   - The function is invoked once per instance, on the first access to the property.
 *   - The value is set on the instance
 *   - The property descriptor is a non-enumerable, non-configurable getter.
 *
 * @param initializer A function that returns the value
 * @param writable When set to true the value (after it is initialized) is writable.
 */
export function LazyInit(initializer: Function, writable: boolean = false): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      throw propertyDecoratorOnly('LazyInit');
    }
    return {
      get: function() {
        if (this === target) {
          return initializer;
        }
        Object.defineProperty(this, propertyKey, { value: initializer.call(this), writable });
        return this[propertyKey];
      }
    }
  };
}
