// REMEMBER: Sync types below with Website project.
// -> in entity-types.ts
import { Types } from 'mongoose';

export namespace Lean {
  export interface Application {
    _id: string;
    createdAt: Date;
    description: string;
    name: string;
    owner: User;
    user: User;
    token: string | never;
  }
  export interface Channel {
    _id: string;
    createdAt: Date;
    guildId?: string;
    memberIds?: string[];
    name?: string;
    summary?: string;
    type: ChannelTypes.Type;
  }
  export interface Guild {
    _id: string;
    name: string;
    createdAt: Date;
    nameAcronym: string;
    iconURL?: string;
    ownerId: string;
    channels: Channel[];
    members: GuildMember[];
    roles: Role[];
  }
  export interface GuildMember {
    _id: Types.ObjectId;
    guildId: string;
    roleIds: string[];
    userId: string;
  }  
  export interface Invite {
    _id: string;
    createdAt: Date;
    options?: InviteTypes.Options;
    inviterId: string;
    guildId: string;
    uses: number;
  }  
  export interface Message {
    _id: string;
    authorId: string;
    channelId: string;
    content: string;
    createdAt: Date;
    embed?: MessageTypes.Embed;
    updatedAt?: Date;
  }
  export interface Role {
    _id: string;
    color?: string;
    createdAt: Date;
    guildId: string;
    hoisted: boolean;
    mentionable: boolean;
    name: string;
    permissions: number;
    position: number;
  }
  export interface User {
    _id: string;
    avatarURL: string;
    badges: UserTypes.BadgeType[];
    bot: boolean;
    createdAt: Date;
    email?: never | string;
    friendIds: string[];
    friendRequests: UserTypes.FriendRequest[];
    guilds: string[] | Lean.Guild[];
    status: UserTypes.StatusType;
    username: string;
    verified?: boolean;
    voice: UserTypes.VoiceState;
  } 
}

export namespace ChannelTypes {
  export type Type = 'DM' | 'TEXT' | 'VOICE';

  export interface DM extends Lean.Channel {
    memberIds: string[];
    guildId: never;
    summary: never;
    type: 'DM';
  }
  export interface Text extends Lean.Channel {
    memberIds: never;
    type: 'TEXT';
  }
  export interface Voice extends Lean.Channel {
    memberIds: string[];
    summary: never;
    type: 'VOICE';
  }
}

export namespace InviteTypes {
  export interface Options {
    expiresAt?: Date;
    maxUses?: number;
  }
}

export namespace MessageTypes {
  export interface Embed {
    description: string;
    image: string;
    title: string;
    url: string;
  }
}

export namespace PermissionTypes {
  export enum General {
    VIEW_CHANNELS = 1024,
    MANAGE_NICKNAMES = 512,
    CHANGE_NICKNAME = 256,
    CREATE_INVITE = 128,
    KICK_MEMBERS = 64,
    BAN_MEMBERS = 32,
    MANAGE_CHANNELS = 16,
    MANAGE_ROLES = 8,
    MANAGE_GUILD = 4,
    VIEW_AUDIT_LOG = 2,
    ADMINISTRATOR = 1
  }
  export enum Text {
    ADD_REACTIONS = 2048 * 16,
    MENTION_EVERYONE = 2048 * 8,
    READ_MESSAGES = 2048 * 4,
    MANAGE_MESSAGES = 2048 * 2,
    SEND_MESSAGES = 2048
  }
  export enum Voice {
    MOVE_MEMBERS = 32768 * 8,
    MUTE_MEMBERS = 32768 * 4,
    SPEAK = 32768 * 2,
    CONNECT = 32768
  }
  export const All = {
    ...General,
    ...Text,
    ...Voice,
  }
  export type Permission = General | Text | Voice;
}

export namespace UserTypes {
  export type BadgeType = 'VIEWER' | 'DEVELOPER';
  export interface FriendRequest {
    userId: string,
    type: FriendRequestType
  }
  export type FriendRequestType = 'OUTGOING' | 'INCOMING';
  export type StatusType = 'ONLINE' | 'BUSY' | 'AFK' | 'OFFLINE';
  export class VoiceState {
    channelId?: string;
    guildId?:  string;
    selfMuted = false;
  }
  export interface Self extends Lean.User {
    guilds: Lean.Guild[];
    email: string;
    verified: true;
  }
}

export const patterns = {
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  hexColor: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
  password: /(?=.*[a-zA-Z0-9!@#$%^&*])/,
  snowflake: /^\d{18}$/,
  status: /^ONLINE|^BUSY$|^AFK$|^OFFLINE$/,
  textChannelName: /^[A-Za-z\-\d]+$/,
  username: /(^(?! |^everyone$|^here$|^me$|^someone$|^discordtag$)[A-Za-z\d\-\_]{2,32}(?<! )$)/,
}
