// types.ts

export type GeminiPayload = {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
};