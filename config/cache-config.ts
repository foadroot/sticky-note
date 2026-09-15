export const CacheTags = {
  example: {
    list: "examples",
    item: (id: string) => [`examples`, `example-${id}`],
  },
} as const;
