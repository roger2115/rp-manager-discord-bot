import axios from 'axios';

/**
 * Check if user has staff permissions (BAN_MEMBERS or KICK_MEMBERS) in a guild
 */
export async function hasStaffOverride(userId: string, guildId: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const member = response.data;
    
    // Check if user has administrator permission
    if (member.permissions && (BigInt(member.permissions) & BigInt(0x8)) === BigInt(0x8)) {
      return true;
    }

    // Check roles for BAN_MEMBERS (0x4) or KICK_MEMBERS (0x2) permissions
    if (member.roles && member.roles.length > 0) {
      const guildResponse = await axios.get(
        `https://discord.com/api/v10/guilds/${guildId}/roles`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );

      const roles = guildResponse.data;
      
      for (const roleId of member.roles) {
        const role = roles.find((r: any) => r.id === roleId);
        if (role && role.permissions) {
          const permissions = BigInt(role.permissions);
          // Check for BAN_MEMBERS or KICK_MEMBERS
          if ((permissions & BigInt(0x4)) === BigInt(0x4) || (permissions & BigInt(0x2)) === BigInt(0x2)) {
            return true;
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking staff permissions:', error);
    return false;
  }
}