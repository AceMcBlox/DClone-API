import { Guild, GuildDocument } from '../../data/models/guild';
import { GuildMember, GuildMemberDocument } from '../../data/models/guild-member';
import { Permission, Role, TextChannelPermission } from '../../data/models/role';
import jwt from 'jsonwebtoken';
import Deps from '../../utils/deps';
import { WebSocket } from '../websocket/websocket';
import { Socket } from 'socket.io';
import Channels from '../../data/channels';

export class WSGuard {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private ws = Deps.get<WebSocket>(WebSocket)
  ) {}

  private userId(client: Socket) {
    return this.ws.sessions.get(client.id);
  }

  public validateIsUser(client: Socket, userId: string) {
    if (this.userId(client) !== userId)
      throw new TypeError('Unauthorized');
  }

  public async canAccessChannel(client: Socket, channelId: string) {
    const userId = this.userId(client);
    const channel = await this.channels.get(channelId);    

    const canAccess = (channel.type === 'DM')
      ? channel.recipientIds?.includes(userId)
      : await this.can(userId, channel.guildId, TextChannelPermission.SEND_MESSAGES);    
    if (!canAccess)
      throw new TypeError('Missing Permissions');    
  }
  
  public async can(userId: string, guildId: string, permission: Permission) {
    const member = await GuildMember.findOne({ guildId, user: userId as any });
    if (!member) return false;
  
    const guild = await Guild.findById(guildId);
    const highestRole = await this.getHighestRole(member, guild);
  
    return Boolean(highestRole?.permissions & permission)
      || (guild.owner.id ?? guild.owner) === userId;
  }

  private async getHighestRole(member: GuildMemberDocument, guild: GuildDocument) {
    const roleId = member.roleIds[member.roleIds.length - 1];
    return await Role.findById(roleId);
  }
  

  public decodeKey(key: string) {
    const token: any = jwt.decode(key);
    return { id: token?._id as string };
  }
}