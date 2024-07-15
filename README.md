# discordjs-components

Powerful and fully typed framework for [Discord.js](https://github.com/discordjs) to simplify message components usage.

```ts
const { Client } = require('discord.js-components')
const client = new Client()

client.handleInteractions()
client.login()
```

Example with a button.

```ts
const { Button } = require('discord.js-components')

const button = new Button('Button label')

button.setLogic(() => (client, interaction) => {
    interaction.reply('So simple!')
})
```

## Roadmap

- [X] Buttons
- [ ] Select menus
- [ ] Modals
