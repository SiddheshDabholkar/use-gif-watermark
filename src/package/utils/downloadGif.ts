export const downloadGif = (file: File) => {
  const link = document.createElement("a");
  link.download = file.name;
  link.title = file.name;
  link.href = URL.createObjectURL(file);
  link.click();
};
