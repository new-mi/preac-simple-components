import { buildComponentFunction } from "./factory";

export {};

declare global {
  interface Window {
    simpleComponents: {
      [key: string]: ReturnType<typeof buildComponentFunction>;
    };
  }
}
