export function values<T>(obj: object): T[] {
    const keys = Object.keys(obj) as Array<keyof typeof obj>;
    return keys.map<T>(key => obj[key]);
}
