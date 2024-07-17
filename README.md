[![NPM](https://img.shields.io/badge/Get%20on%20NPM-v0.2.0-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@loidnoir/discordjs-components)



# Discord.JS Components

A powerful, fully typed, and user-friendly framework designed to simplify the usage of Discord's components. Focus on what truly matters and leave the rest to us.

## Quick Start

Setup with just one call.

```bash
npm i @loidnoir/discordjs-components
```

```ts
const { Client } = require('discord.js-components');
const client = new Client();
`
client.handleInteractions();
client.login();
```

### Working with buttons

Want to create a complex navigation system with buttons effortlessly, without the hassle of managing responses and custom ids. We have you covered.

```ts
import { Component } from '@loidnoir/discordjs-components';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const buttonId = 'some id';
const button = new ButtonBuilder()
    .setCustomId(buttonId)
    .setStyle(ButtonStyle.Secondary)
    .setLabel('No way this is so easy');

new Component(client, button, buttonId)
    .execute((client, int) => int.update('Yes it is'));
```

### Components limitation

Achieve specific goals by limiting user access to your components by time or usage amount.

```ts
new Component(client, button, buttonId)
    .execute((client, int) => int.update('Wow!'))
    .setMaxDuration(10)
    .setMaxUsageAmount(3);
```

## Features

- [X] Full support for Buttons, Select-menus, and Modals
- [X] Fully typed and user-friendly experience
- [ ] Autocomplete support
- [ ] Documentation page
