
export function removeKeysFromObject<
    T extends Record<string, any>,
    U extends keyof T
>(data: T, ...keys: U[]): Omit<T, U> {
    return Object.keys(data).reduce((acc, key) => {
        if (!(keys as string[]).includes(key)) {
            acc[key as keyof T] = data[key];
        }
        return acc;
    }, {} as T);
}
