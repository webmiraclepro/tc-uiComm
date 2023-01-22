import { StateCreator } from 'zustand';
import IAuth, { IGuildChannels, ISubChannels } from '../types/IAuth';
import { conf } from '../../configs';
import { axiosInstance } from '../../axiosInstance';
import { StorageService } from '../../services/StorageService';

const BASE_URL = conf.API_BASE_URL;

const createAuthSlice: StateCreator<IAuth> = (set, get) => ({
  isLoggedIn: false,
  isLoading: false,
  user: {},
  guildChannels: [],
  redirectToDiscord: () => {
    location.replace(`${BASE_URL}/auth/login`);
  },
  loginWithDiscord: (user: any) =>
    set((state) => {
      const guild = Object.assign(
        {},
        { guildId: user.guildId, guildName: user.guildName }
      );
      const token = Object.assign(
        {},
        {
          accessToken: user.accessToken,
          accessExp: user.accessExp,
          refreshToken: user.refreshToken,
          refreshExp: user.refreshExp,
        }
      );
      StorageService.writeLocalStorage('guild', guild);
      StorageService.writeLocalStorage('access_token', token.accessToken);
      StorageService.writeLocalStorage('refresh_Token', token.refreshToken);
      if (user.isSuccessful) {
        state.isLoggedIn = user.isSuccessful;
      }
      return { user };
    }),
  fetchGuildChannels: async (guild_id) => {
    try {
      set(() => ({ isLoading: true }));
      const { data } = await axiosInstance.get(`/guilds/${guild_id}/channels`);
      data.map((el: IGuildChannels) => {
        el.subChannels.map((channel: ISubChannels) => {
          channel.isChecked = true;
        });
      });
      set({ guildChannels: [...data], isLoading: false });      
    } catch (error) {}
  },
  changeEmail: async (emailAddress: string) => {
    try {
      set(() => ({ isLoading: true }));
      await axiosInstance.patch(`/users/@me`, {
        email: emailAddress,
      });
      set({ isLoading: false });
    } catch (error) {}
  },
});

export default createAuthSlice;
