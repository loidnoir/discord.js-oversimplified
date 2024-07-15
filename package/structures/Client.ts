import { ButtonInteraction, ClientOptions, Collection, Client as DjsClient, Interaction } from 'discord.js'
import Button from './Button'

export default class Client extends DjsClient {
    buttons: Collection<string, Button> = new Collection()

    constructor(options: ClientOptions) {
        super(options)
    }

    public handleInteractions(settings?: InteractionHandleSettings) {
        this.on('interactionCreate', (interaction: Interaction) => {
            if (interaction.isButton()) this.handleButtons(interaction, settings?.buttonDurationError, settings?.buttonMaxUsageError)
        })
    }

    private handleButtons(
        interaction: ButtonInteraction,
        handleTimeError?: InteractionHandleSettings['buttonDurationError'],
        handleUsageLimitError?: InteractionHandleSettings['buttonMaxUsageError'],
        handleError?: InteractionHandleSettings['buttonError'])
    {
        const button = this.buttons.find(button => button.id == interaction.customId)

        if (button) {
            if (!button.id || button?.preferences.guildOnly && !interaction.inGuild()) return
            
            if (button?.logic) {
                button.logic(this, interaction)
            }
            
            if (button.options.maxUsage && button.options.maxUsage > 0) {
                button.usageAmount += 1
                
                if (button.options.maxUsage <= button.usageAmount) {
                    this.buttons.delete(button.id)
                }
            }
            
            if (button.options.durationSec && button.options.durationSec > 0) {
                if (button.createdAt + (1000 * button.options.durationSec) <= Date.now()) {
                    this.buttons.delete(button.id)
                }
            }
        }

        else {
            if (interaction.customId[0] == 't') {
                if (handleTimeError) {
                    handleTimeError(this, interaction)
                }
                else {
                    interaction.reply({ content: 'Interaction is out of time usage', ephemeral: true })
                }
            }

            else if (interaction.customId[1] == 'd') {
                if (handleUsageLimitError) {
                    handleUsageLimitError(this, interaction)
                }
                else {
                    interaction.reply({ content: 'Interaction is out of max usage', ephemeral: true })
                }
            }

            else {
                if (handleError) {
                    handleError(this, interaction)
                }
                else {
                    interaction.reply({ content: 'Interaction expired', ephemeral: true })
                }
            }
        }
    }
}

interface InteractionHandleSettings {
    buttonDurationError?: (client: Client, interaction: ButtonInteraction) => void,
    buttonMaxUsageError?: (client: Client, interaction: ButtonInteraction) => void,
    buttonError?: (client: Client, interaction: ButtonInteraction) => void
}