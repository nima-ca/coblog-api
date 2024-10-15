export const countByKey = <T>(array: T[], key: string, value: string) =>
    array.reduce((count, obj) => (obj[key] === value ? count + 1 : count), 0);
