import { ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentEmojiResolvable } from "discord.js"
import Client from "./Client"
import Component, { ComponentLimits } from "./Component"

export default class Button extends Component<ButtonInteraction> {
    public preferences: ButtonPreferences

    constructor(client: Client, preferences: ButtonPreferences, limits?: ComponentLimits) {
        super(limits)
        this.preferences = preferences
        client.components.set(this.id, this)
    }

    setLogic(logic: (client: Client, interaction: ButtonInteraction) => void) {
        super.setLogic(logic)
    }

    getData() {
        const button = new ButtonBuilder()
            .setCustomId(this.id)
            .setLabel(this.preferences.label)
            .setStyle(ButtonStyle.Secondary)
            
        if (this.preferences.disabled) {
            button.setDisabled(true)
        }

        if (this.preferences.emoji) {
            button.setEmoji(this.preferences.emoji)
        }

        if (this.preferences.style) {
            button.setStyle(this.preferences.style)
        }

        if (this.preferences.url) {
            button.setURL(this.preferences.url)
        }

        return button
    }
}

interface ButtonPreferences {
    label: string
    style?: ButtonStyle
    emoji?: ComponentEmojiResolvable
    disabled?: boolean
    url?: string
}