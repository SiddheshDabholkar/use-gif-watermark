export const base64toGIF = (base64String: string) => {
  if (!base64String) {
    console.error("base64string cannot be empty");
    return;
  }
  const base64Content = base64String.split(";base64,").pop();
  if (!base64Content) {
    console.error("base64 is empty or is empty");
    return;
  }

  const byteCharacters = atob(base64Content);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: "image/gif" });
  const file = new File([blob], `${Date.now()}.gif`, { type: "image/gif" });
  return file;
};
