import { ClientOptions, Collection, Client as DjsClient, Interaction as DjsInteraction } from 'discord.js';
import Component, { ComponentErrors } from './Component';

export default class Client extends DjsClient {
    components: Collection<string, Component<any>> = new Collection()

    constructor(options: ClientOptions) {
        super(options)
    }

    public handleInteractions(settings?: ComponentErrors) {
        this.on('interactionCreate', (interaction: DjsInteraction) => {
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
                const component = this.components.get(interaction.customId)
                
                if (component) {
                    if (component.limits.maxUsageAmount && component.usageCount >= component.limits.maxUsageAmount) {
                        if (interaction.customId[1] == 'd') {
                            if (settings?.maxUsageError) settings?.maxUsageError(this, interaction)
                                else interaction.reply({ content: 'Interaction is out of max usage', ephemeral: true })
                        }
                        
                        this.components.delete(component.id)
                    }
                    
                    else if (component.limits.maxDurationSec && (component.createdAt + (1000 * component.limits.maxDurationSec)) <= Date.now()) {
                        if (interaction.customId[0] == 't') {
                            if (settings?.maxDurationError) settings.maxDurationError(this, interaction)
                                else interaction.reply({ content: 'Interaction is out of time usage', ephemeral: true })
                        }

                        this.components.delete(component.id)    
                    }

                    else if (component.logic) {
                        component.logic(this, interaction)
                        component.usageCount++
                    }
                }

                else {
                    if (settings?.undefinedError) settings.undefinedError(this, interaction)
                    else interaction.reply({ content: 'Interaction expired', ephemeral: true })
                }
            }
        })
    }
}
