import { ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, SlashCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import Client from "./Client";

export default class Command<BuilderType extends CommandBuilderTypes> {
    public data?: BuilderType
    public logic?: CommandLogic<BuilderType>
    public cooldown: number = 0
    public guild?: string

    public setData(data: BuilderType) {
        this.data = data
        return this
    }
    
    public setLogic(logic: CommandLogic<BuilderType>) {
        this.logic = logic
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

export type CommandLogic<BuilderType> = (client: Client, interaction: CommandInteractionTypeFromBuilder<BuilderType>) => void

export type CommandBuilderTypes = SlashCommandBuilder | ContextMenuCommandBuilder
    
export type CommandInteractionTypes = ChatInputCommandInteraction | ContextMenuCommandInteraction


type CommandInteractionTypeFromBuilder<BuilderType> =
    BuilderType extends SlashCommandBuilder ? ChatInputCommandInteraction :
    BuilderType extends ContextMenuCommandBuilder ? UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction :
    CommandInteraction