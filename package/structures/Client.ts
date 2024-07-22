import { ClientOptions, Collection, Client as DjsClient } from 'discord.js';
import fs from 'fs';
import path from 'path';
import Command, { CommandBuilderTypes, CommandInteractionTypes } from './Command';
import Component, { ComponentInteractionTypes } from './Component';

export default class Client extends DjsClient {
    private commandsPath?: string

    components: Collection<string, Component<any>> = new Collection()
    commands: Collection<string, Command<any>> = new Collection()
    cooldowns: Collection<string, number> = new Collection()

    cooldownError?: CooldownError
    componentError?: ComponentError
    commandError?: CommandError

    constructor(options: ClientOptions) {
        super(options)
    }

    public setCooldownError(error: CooldownError) {
        this.cooldownError = error
    }

    public setComponentError(error: ComponentError) {
        this.componentError = error
    }

    public setCommandError(error: CooldownError) {
        this.cooldownError = error
    }
    
    public enableCommands(path: string) {
        this.commandsPath = path
    }

    public handle() {
        this.once('ready', () => this.commandsPath ? this.loadCommands() : null)
        this.on('interactionCreate', (interaction) => {
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) this.handleComponents(interaction)
            else if (interaction.isCommand() && this.commandsPath) this.handleCommands(interaction)
        })
    }

    private async loadCommands(): Promise<void> {
        const stack = [this.commandsPath]

        while (stack.length > 0) {
            const currentPath = stack.pop()
            const entries = fs.readdirSync(currentPath!, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(currentPath!, entry.name)

                if (entry.isDirectory()) {
                    stack.push(fullPath)
                }
                
                else if (entry.isFile()) {
                    const command: Command<CommandBuilderTypes> = (await import(fullPath)).default
                    if (!command.data) return
                    
                    this.commands.set(command.data.name, command)

                    if (command.guild) {
                        let guild = this.guilds.cache.get(command.guild)

                        if (!guild) {
                            guild = await this.guilds.fetch(command.guild)
                        }

                        guild.commands.create(command.data)
                    }

                    else {
                        this.application?.commands.create(command.data)
                        console.log(command.data.name)
                    }
                }
            }
        }
    }

    private handleCommands(interaction: CommandInteractionTypes) {
        const command = this.commands.get(interaction.commandName)

        if (command && command.logic) {
            if (command?.data && command.data.cooldownSeconds) {
                const id = `${interaction.commandName}-${interaction.user.id}`
                const cooldownState = this.cooldowns.get(id)
                const date = Date.now() + command.data.cooldownSeconds

                if (cooldownState) {
                    if (Date.now() > cooldownState) {
                        command.logic(this, interaction)
                        this.cooldowns.set(id, date)
                    }
                    
                    else {
                        if (this.cooldownError) {
                            this.cooldownError(this, interaction, new Date(cooldownState))
                        }
                        
                        else {
                            interaction.reply({ content: 'Command is on cooldown', ephemeral: true })
                        }
                    }
                }
                
                else {
                    this.cooldowns.set(id, date)
                    command.logic(this, interaction)
                }
            }

            else {
                command.logic(this, interaction)
            }
        }
    }

    private handleComponents(interaction: ComponentInteractionTypes): void {
        const component = this.components.get(interaction.customId)

        if (component && component.logic) {
            if (component.isExpired()) {
                if (this.componentError) this.componentError(this, interaction) 
                else interaction.reply({ content: 'Interaction expired', ephemeral: true })
            }

            else {
                component.logic(this, interaction)
                component.addUsage(1)
            }
        }    
    }
}

type ComponentError = (Client: Client, interaction: ComponentInteractionTypes) => void
type CooldownError = (client: Client, interaction: CommandInteractionTypes, expireDate: Date) => void
type CommandError = (client: Client, interaction: CommandInteractionTypes) => void