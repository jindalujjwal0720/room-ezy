export const downloadFileFromAPI = async (url: string, filename: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('room-ezy-access-token')}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  a.remove();
};
