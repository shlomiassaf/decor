import { ReadonlyProto } from '../src/readonly-proto';

describe('ReadonlyProto', () => {
  const value = {};
  const lazyValue = {};
  const lazyValueGetter = () => lazyValue;

  class Test {
    @ReadonlyProto(value)
    readonly readonlyProp: any;

    @ReadonlyProto(value)
    prop: any;

    @ReadonlyProto(lazyValueGetter, true)
    lazyProp: any;
  }

  it('sets the readonly value on the prototype.', ()=> {
    expect(Test.prototype.readonlyProp).toEqual(value);
  });

  it('returns the readonly value when accessing the property', ()=> {
    const instance = new Test();
    expect(instance.prop).toEqual(value);
    expect(instance.readonlyProp).toEqual(value);
  });

  it('returns the lazy getter when accessing the property on the prototype', ()=> {
    expect(Test.prototype.lazyProp).toEqual(lazyValueGetter);
  });

  it('returns the lazy value when accessing the property', ()=> {
    const instance = new Test();
    expect(instance.lazyProp).toEqual(lazyValue);
  });

  it('does not allow assignment', ()=> {
    const instance = new Test();
    expect(() => instance.prop = {}).toThrowError(`Cannot assign to read only property 'prop' of object '#<Test>'`);
    expect(() => instance.lazyProp = {}).toThrowError(`Cannot set property lazyProp of #<Test> which has only a getter`);
  });
});
