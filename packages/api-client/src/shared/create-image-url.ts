import { API_BASE_URL } from '../client/config';

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export const createImageUrl = (imagePath: string) => {
  if (isAbsoluteUrl(imagePath)) {
    return imagePath;
  }

  return new URL(imagePath, API_BASE_URL).toString();
};
