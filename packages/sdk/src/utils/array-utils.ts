export const safePush = <T>(arr: T[] | undefined, value: T): T[] => (arr ? [...arr, value] : [value])
export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
