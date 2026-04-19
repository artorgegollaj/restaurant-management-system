import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

const API = 'http://localhost:8080/api';

class AuthStore {
  accessToken = null;
  refreshToken = null;
  username = null;
  roles = [];

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }

  async login(username, password) {
    const res = await axios.post(`${API}/auth/login`, { username, password });
    runInAction(() => {
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
      this.username = res.data.username;
      this.roles = res.data.roles || [];
    });
  }

  async register(username, email, password) {
    await axios.post(`${API}/auth/register`, { username, email, password });
  }

  async refresh() {
    if (!this.refreshToken) throw new Error('No refresh token');
    const res = await axios.post(`${API}/auth/refresh`, { refreshToken: this.refreshToken });
    runInAction(() => {
      this.accessToken = res.data.accessToken;
      this.refreshToken = res.data.refreshToken;
    });
    return this.accessToken;
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await axios.post(`${API}/auth/logout`, { refreshToken: this.refreshToken });
      }
    } catch (_) {}
    runInAction(() => {
      this.accessToken = null;
      this.refreshToken = null;
      this.username = null;
      this.roles = [];
    });
  }
}

export const authStore = new AuthStore();
