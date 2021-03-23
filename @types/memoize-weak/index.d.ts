export default function <T extends (...args: unknown[]) => unknown>(fn: T): T;
