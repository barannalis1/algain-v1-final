type Primitive = string | number | boolean | null | undefined;
type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];
export type ClassValue = Primitive | ClassDictionary | ClassArray;

function toString(value: ClassValue): string {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(toString).filter(Boolean).join(" ");
  }
  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key)
    .join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return inputs.map(toString).filter(Boolean).join(" ");
}

export function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function assertEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
}
