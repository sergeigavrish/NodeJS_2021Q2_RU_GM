import { format } from 'util';

export function formatString<T = any>(str: string, ...params: T[]): string {
    return format(str, ...params.map(param => param && typeof param === 'object' ? JSON.stringify(param) : param))
}