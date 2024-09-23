import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    UserContextMenuCommandInteraction,
} from 'discord.js'
import Client from '../structures/Client'

export default class CommandBuilder<BuilderType extends CommandBuilderTypes> {
    public commandData?: BuilderType
    public commandLogic?: CommandLogic<BuilderType>
    public autocompleteLogic?: AutocompleteLogic
    public cooldown: number = 0
    public guild?: string

    constructor(data: BuilderType) {
        this.commandData = data
    }

    public setCommandLogic(logic: CommandLogic<BuilderType>) {
        this.commandLogic = logic
        return this
    }

    public setAutocompleteLogic(logic: AutocompleteLogic) {
        this.autocompleteLogic = logic
        return this
    }

    public setCooldown(seconds: number) {
        this.cooldown = seconds * 1000
        return this
    }

    public setGuild(guild: string) {
        this.guild = guild
        return this
    }
}

export type CommandBuilderTypes = SlashCommandBuilder | ContextMenuCommandBuilder

export type CommandLogic<BuilderType> = (
    client: Client,
    interaction: CommandInteractionTypeFromBuilder<BuilderType>
) => void

export type AutocompleteLogic = (client: Client, interaction: AutocompleteInteraction) => void

export type CommandInteractionTypes = ChatInputCommandInteraction | ContextMenuCommandInteraction

type CommandInteractionTypeFromBuilder<BuilderType> = BuilderType extends SlashCommandBuilder
    ? ChatInputCommandInteraction
    : BuilderType extends ContextMenuCommandBuilder
      ? UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction
      : CommandInteraction
