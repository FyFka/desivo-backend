export const validatorFactory = (
  required: string[],
  properties: { [key: string]: { type: 'string' | number } },
) => {
  return {
    schema: {
      body: {
        type: 'object',
        required,
        properties,
      },
    },
  };
};
