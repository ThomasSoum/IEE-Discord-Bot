const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contact')
    .setDescription("Replies with the department's contact information"),
  async execute(interaction) {
    const msg = new MessageEmbed()
      .setColor('#0d86e3')
      .setTitle('Tμήμα Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων')
      .setURL('https://www.iee.ihu.gr/')
      .setDescription('Οι ώρες εξυπηρέτησης των φοιτητών και του κοινού είναι καθημερινά, από ώρα 12:00 έως 14:00 από τη θυρίδα της γραμματείας, στο ισόγειο του κτιρίου του  πρώην Τμήματος Ηλεκτρονικών Μηχανικών (ΤΕ) του ΑΤΕΙΘ.  Παρακαλούνται οι φοιτητές/τριες του τμήματος όταν συναλλάσσονται με τη Γραμματεία του Tμήματος να έχουν πάντα μαζί τους τη φοιτητική τους ταυτότητα.')
      .setThumbnail(url = "attachment://department_logo.png")
      .addFields(
        { name: 'Phone:', value: '2310 013621' },
        { name: "Ε-mail Γραμματείας:", value: 'info@iee.ihu.gr', inline: true },
        { name: 'Fax:', value: '2310 791132', inline: true }
      )
      .setFooter({ text: 'Για τα στοιχεία επικοινωνίας των καθηγητών χρησιμοποίησε την εντολή: /professors' })
    await interaction.reply({ files: [{ attachment: path.join(__dirname, '../images/department_logo.png'), name: 'department_logo.png' }], embeds: [msg], ephemeral: true });
  }
}