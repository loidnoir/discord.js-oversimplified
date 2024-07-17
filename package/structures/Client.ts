import { ClientOptions, Collection, Client as DjsClient } from 'discord.js';
import Component, { InteractionTypes, LogicType } from './Component';


export default class Client extends DjsClient {
    components: Collection<string, Component<any>> = new Collection()

    constructor(options: ClientOptions) {
        super(options)
    }

    public handleComponents(error?: LogicType<InteractionTypes>): void {
        this.on('interactionCreate', (interaction) => {
            if (
                interaction.isButton() ||
                interaction.isAnySelectMenu() ||
                interaction.isModalSubmit()
            ) {
                const component = this.components.get(interaction.customId)

                if (component && component.logic) {
                    if (component.isExpired()) {
                        if (error) error(this, interaction)
                        else interaction.reply({ content: 'Interaction expired', ephemeral: true })
                    }

                    else {
                        component.logic(this, interaction)
                        component.addUsage(1)
                    }
                }
            }
        })
    }
}