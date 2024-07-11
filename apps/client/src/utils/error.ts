export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: { message: string } }).data;
    return data.message;
  }

  return 'Something went wrong';
};
