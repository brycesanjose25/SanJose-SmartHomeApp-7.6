import { Platform } from 'react-native';

const localWebUrl = 'http://localhost:3000/api';
const localAndroidUrl = 'http://10.0.2.2:3000/api';

export const API_BASE_URL = Platform.select({
  ios: localWebUrl,
  android: localAndroidUrl,
  default: localWebUrl,
});

export const API_ENDPOINTS = {
  sensors: '/sensors',
  devices: '/devices',
  deviceStatus: (id: number) => `/devices/${id}/status`,
};
