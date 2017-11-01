import { LazyInit } from '../src/lazy-init';

describe('LazyInit', () => {
  const lazyValue = {};
  const lazyValueGetter = () => lazyValue;

  class Test {
    @LazyInit(lazyValueGetter)
    lazyProp: any;

    @LazyInit(() => (new Test()) )
    lazyPropDynamic: Test;

    @LazyInit(() => (new Test()), true)
    lazyPropDynamicWritable: Test;
  }

  it('returns the lazy getter when accessing the property on the prototype', ()=> {
    expect(Test.prototype.lazyProp).toEqual(lazyValueGetter);
  });

  it('does not invoke the initializer until it is accessed', ()=> {
    const instance = new Test();
    Object.setPrototypeOf(instance, {});
    expect(instance.lazyProp).toBeUndefined();
  });

  it('returns the lazy value when accessing the property', ()=> {
    const instance = new Test();
    expect(instance.lazyProp).toEqual(lazyValue);
  });

  it('does not allow writing unless explicitly set', ()=> {
    const instance = new Test();
    expect(instance.lazyProp).toEqual(lazyValue);
    expect(() => instance.lazyProp = {}).toThrowError(`Cannot assign to read only property 'lazyProp' of object '#<Test>'`);
  });

  it('allow writing if explicitly set', ()=> {
    const instance = new Test();
    const lazy = instance.lazyPropDynamicWritable;
    expect(lazy).toBeInstanceOf(Test);

    const newValue = new Test();
    instance.lazyPropDynamicWritable = newValue;
    expect(instance.lazyPropDynamicWritable).toBeInstanceOf(Test);
  });

  it('sets the property once per instance', ()=> {
    const instance1 = new Test();
    const instance2 = new Test();
    const lazy1 = instance1.lazyPropDynamic;
    const lazy2 = instance2.lazyPropDynamic;

    expect(lazy1).toBeInstanceOf(Test);
    expect(lazy2).toBeInstanceOf(Test);

    expect(lazy1).not.toBe(lazy2);

    expect(instance1.lazyPropDynamic).toBe(lazy1);
    expect(instance2.lazyPropDynamic).toBe(lazy2);
  });


  it('does not allow assignment', ()=> {
    const instance = new Test();
    expect(() => instance.lazyProp = {}).toThrowError(`Cannot set property lazyProp of #<Test> which has only a getter`);
  });
});
