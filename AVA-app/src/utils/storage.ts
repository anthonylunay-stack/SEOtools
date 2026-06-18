import * as SecureStore from 'expo-secure-store';

export const storage = {
  async setToken(token: string) {
    await SecureStore.setItemAsync('auth_token', token);
  },
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('auth_token');
  },
  async deleteToken() {
    await SecureStore.deleteItemAsync('auth_token');
  },
  async setUser(user: object) {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  },
  async getUser() {
    const v = await SecureStore.getItemAsync('user');
    return v ? JSON.parse(v) : null;
  },
};
