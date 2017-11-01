export function propertyDecoratorOnly(name: string): Error {
  return new Error(`@${name} can only decorate class properties.`);
}
