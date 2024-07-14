export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: { message: string } }).data;
    return data.message;
  }

  return 'Something went wrong';
};
