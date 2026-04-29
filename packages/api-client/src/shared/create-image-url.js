import { API_BASE_URL } from '../client/config';
const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);
export const createImageUrl = (imagePath) => {
    if (isAbsoluteUrl(imagePath)) {
        return imagePath;
    }
    return new URL(imagePath, API_BASE_URL).toString();
};
