/* eslint-disable @typescript-eslint/no-unused-vars */

//exclude propertis form object
export function excludeProperties<
  T extends Record<string, any>,
  K extends keyof T,
>(obj: T, keys: K[]): Omit<T, K> {
  const { [keys[0]]: omitted, ...rest } = obj;
  if (keys.length === 1) {
    return rest as Omit<T, K>;
  }
  return excludeProperties(rest as T, keys.slice(1)) as Omit<T, K>;
}

//exclude propertis form array of object
export function excludeKeysFromArrayOfObjects<
  T extends Record<string, any>,
  K extends keyof T,
>(array: T[], keys: K[]): Omit<T, K>[] {
  return array.map((obj) => {
    const { [keys[0]]: omitted, ...rest } = obj;
    if (keys.length === 1) {
      return rest as Omit<T, K>;
    }
    return excludeKeysFromArrayOfObjects([rest as T], keys.slice(1))[0];
  });
}
