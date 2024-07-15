import { ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentEmojiResolvable } from "discord.js"
import { v4 } from 'uuid'
import Client from "./Client"

export default class Button {
    public id?: string
    public preferences: ButtonPreferences
    public options: ButtonOptions
    public logic?: (client: Client, interaction: ButtonInteraction) => void
    public createdAt: number
    public usageAmount: number

    constructor(client: Client, options: ButtonOptions, preferences: ButtonPreferences) {
        const idFlags = `${options.durationSec && options.durationSec > 0 ? 't' : 'n'}${options.maxUsage && options.maxUsage > 0 ? 'd' : 'n'}`
        this.id = idFlags + v4()

        this.preferences = preferences
        this.options = options
        this.createdAt = Date.now()
        this.usageAmount = 0

        client.buttons.set(this.id, this)
    }

    setLogic(logic: (client: Client, interaction: ButtonInteraction) => void) {
        this.logic = logic
    }

    getData() {
        if (!this.id) return undefined

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
    guildOnly?: boolean
}

interface ButtonOptions {
    durationSec?: number
    maxUsage?: number
}