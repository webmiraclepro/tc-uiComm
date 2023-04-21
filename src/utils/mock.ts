import { IDiscordRole, IUserHandler } from '@/utils/types';

export const userHandlers: IUserHandler[] = [
  {
    avatar: '/avatars/avatar1.png',
    name: 'Planet B',
    isOwner: true,
  },
  {
    avatar: '/avatars/avatar2.png',
    name: 'Jane T',
    isOwner: false,
  },
  {
    avatar: '/avatars/avatar1.png',
    name: 'Bloomberg',
    isOwner: false,
  },
  {
    avatar: '/avatars/avatar1.png',
    name: 'Celeste',
    isOwner: false,
  },
  {
    avatar: '/avatars/avatar2.png',
    name: 'Jocelyn',
    isOwner: false,
  },

];

export const roleLists: IDiscordRole[] = [
  {
    title: 'Expert',
    level: '1'
  },
  {
    title: 'Axa-project',
    level: '1'
  },
  {
    title: 'XY-project',
    level: '1'
  },
  {
    title: 'Collaborator',
    level: '2'
  },
  {
    title: 'DAO work general',
    level: '2'
  },
  {
    title: 'Supporter',
    level: '2'
  },
  {
    title: 'Research Coordinator - Supporter',
    level: '3'
  },
  {
    title: 'Axa-project',
    level: '1'
  },
  {
    title: 'XY-project',
    level: '1'
  },
  {
    title: 'Axa-project',
    level: '1'
  },
];

