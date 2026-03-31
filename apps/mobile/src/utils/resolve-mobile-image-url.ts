import { createImageUrl } from '@acme/api-client';
import { NativeModules } from 'react-native';

const getDevServerHost = () => {
  const scriptURL = NativeModules.SourceCode?.scriptURL;

  if (typeof scriptURL !== 'string' || scriptURL.length === 0) {
    return null;
  }

  const hostMatch = scriptURL.match(/^(?:https?|exp|exps):\/\/([^/:]+)/i);

  return hostMatch?.[1] ?? null;
};

export const resolveMobileImageUrl = (imagePath: string) => {
  const imageUrl = createImageUrl(imagePath);
  const devServerHost = getDevServerHost();

  if (!devServerHost) {
    return imageUrl;
  }

  return imageUrl.replace('://localhost', `://${devServerHost}`);
};
