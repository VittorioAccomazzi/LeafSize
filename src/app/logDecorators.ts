

//
// Method decorators
//
export default  function timeTaken  (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any) {
      const start = Date.now();
      const result = originalMethod.apply(this, args);
      const finish = Date.now();
      console.log(`${target.name}.${propertyKey}: ${finish - start} ms`);
      return result;
    };
  
    return descriptor;
  }

  export function logParameters (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`${target.name}.${propertyKey}: ${args.length} parameters :`);
      for( let [key,val] of Object.entries(args) ){
          console.log(`  ${key} : ${val}`)
      }
      const result = originalMethod.apply(this, args);
      return result;
    };
  
    return descriptor;
  }

//
//  Class Decorator
//
export function addToString(target: any) {
    target.prototype.toString = () : string => {
        return `object of type ${target.name}`
    }
    return target
}
