// Dependencies
const Discord = require('discord.js');

module.exports.run = async (bot, message, args, emoji, settings) => {
	// Make sure that REPORT is in the mod logs
	if (settings.ModLogEvents.includes('REPORT')) {
		if (message.deletable) message.delete();
		// Find user
		const user = message.mentions.members.first() || message.guild.members.get(args[0]);
		if (!user) {
			message.channel.send({ embed:{ color:15158332, description:`${emoji} I was unable to find this user.` } }).then(m => m.delete({ timeout: 10000 }));
			return;
		}
		// Make sure a reason was added
		if (!args[1]) {
			message.channel.send({ embed:{ color:15158332, description:`${emoji} Please use the format \`${bot.commands.get('report').help.usage.replace('${PREFIX}', settings.prefix)}\`.` } }).then(m => m.delete({ timeout: 5000 }));
			return;
		}
		// Send messages to ModLog channel
		const embed = new Discord.MessageEmbed()
			.setAuthor('~Member Reported~', user.user.displayAvatarURL)
			.addField('Member:', user, true)
			.addField('Reported by:', message.member, true)
			.addField('Reported in:', message.channel)
			.addField('Reason:', args.slice(1).join(' '))
			.setTimestamp()
			.setFooter(message.guild.name);
		const repChannel = message.guild.channels.cache.find(channel => channel.name === settings.ModLogChannel);
		if (repChannel) {
			repChannel.send(embed);
			message.channel.send({ embed:{ color:3066993, description:`${bot.config.emojis.tick} *${user.user.username} has been successfully reported*.` } }).then(m => m.delete({ timeout: 3000 }));
		}
	}
};

module.exports.config = {
	command: 'report',
	aliases: ['rep'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Report',
	category: 'moderation',
	description: 'Reports a user',
	usage: '${PREFIX}report {user} [reason]',
};
