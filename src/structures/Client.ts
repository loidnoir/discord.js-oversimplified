import { AutocompleteInteraction, ClientEvents, ClientOptions, Collection, Client as DjsClient } from 'discord.js'
import fs from 'fs'
import path from 'path'
import Command, { CommandBuilderTypes, CommandInteractionTypes } from '../builders/CommandBuilder'
import Component, { ComponentInteractionTypes } from '../builders/ComponentBuilder'
import Event from '../builders/EventBuilder'

export default class Client extends DjsClient {
    private commandsPath?: string
    private eventsPath?: string

    components: Collection<string, Component<any>> = new Collection()
    commands: Collection<string, Command<any>> = new Collection()
    events: Collection<string, Event<keyof ClientEvents>> = new Collection()

    cooldowns: Collection<string, number> = new Collection()

    private cooldownError?: CooldownError
    private componentError?: ComponentError
    private componentDurationError?: ComponentDurationError

    constructor(options: ClientOptions) {
        super(options)
    }

    public setCooldownError(error: CooldownError) {
        this.cooldownError = error
    }

    public setComponentError(error: ComponentError) {
        this.componentError = error
    }

    public setComponentDurationError(error: ComponentDurationError) {
        this.componentDurationError = error
    }

    public enableCommands(path: string) {
        this.commandsPath = path
    }

    public enableEvents(path: string) {
        this.eventsPath = path
    }

    public login(token?: string) {
        if (this.eventsPath) this.loadEvents()
        if (this.commandsPath) this.once('ready', () => this.loadCommands())

        this.on('interactionCreate', interaction => {
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit())
                this.handleComponents(interaction)
            else if (interaction.isCommand() && this.commandsPath) this.handleCommands(interaction)
            else if (interaction.isAutocomplete() && this.commandsPath) this.handleAutocomplete(interaction)
        })

        return super.login(token)
    }

    private async loadCommands(): Promise<void> {
        const stack = [this.commandsPath]

        while (stack.length > 0) {
            const currentPath = stack.pop()
            const entries = fs.readdirSync(currentPath!, {
                withFileTypes: true,
            })

            for (const entry of entries) {
                const fullPath = path.join(currentPath!, entry.name)

                if (entry.isDirectory()) stack.push(fullPath)
                else if (entry.isFile()) {
                    const command: Command<CommandBuilderTypes> = (await import(fullPath)).default
                    if (!command.commandData) return

                    this.commands.set(command.commandData.name, command)

                    if (command.guild) {
                        let guild = this.guilds.cache.get(command.guild)

                        if (!guild) guild = await this.guilds.fetch(command.guild)

                        guild.commands.create(command.commandData)
                    } else this.application?.commands.create(command.commandData)
                }
            }
        }
    }

    private async loadEvents(): Promise<void> {
        const stack = [this.eventsPath]

        while (stack.length > 0) {
            const currentPath = stack.pop()
            const entries = fs.readdirSync(currentPath!, {
                withFileTypes: true,
            })

            for (const entry of entries) {
                const fullPath = path.join(currentPath!, entry.name)

                if (entry.isDirectory()) stack.push(fullPath)
                else if (entry.isFile()) {
                    const event: Event<keyof ClientEvents> = (await import(fullPath)).default

                    if (event) {
                        if (event.once)
                            this.once(event.event, (...args) => {
                                if (event.logic) event.logic(this, ...args)
                            })
                        else
                            this.on(event.event, (...args) => {
                                if (event.logic) event.logic(this, ...args)
                            })
                    }
                }
            }
        }
    }

    private handleCommands(interaction: CommandInteractionTypes) {
        const command = this.commands.get(interaction.commandName)

        if (command && command.commandLogic) {
            if (command.cooldown > 0) {
                const id = `${interaction.commandName}-${interaction.user.id}`
                const cooldownState = this.cooldowns.get(id)
                const expireDate = Date.now() + command.cooldown * 1000

                if (cooldownState) {
                    if (Date.now() > cooldownState) {
                        command.commandLogic(this, interaction)
                        this.cooldowns.set(id, expireDate)
                    } else if (this.cooldownError) this.cooldownError(this, interaction, new Date(cooldownState))
                } else {
                    this.cooldowns.set(id, expireDate)
                    command.commandLogic(this, interaction)
                }
            } else command.commandLogic(this, interaction)
        }
    }

    private handleComponents(interaction: ComponentInteractionTypes): void {
        const component = this.components.get(interaction.customId)

        if (component && component.logic) {
            if (component.isExpired() && this.componentDurationError) this.componentDurationError(this, interaction)
            else {
                component.logic(this, interaction)
                component.addUsage(1)
            }
        } else if (this.componentError) this.componentError(this, interaction)
    }

    private handleAutocomplete(interaction: AutocompleteInteraction): void {
        const command = this.commands.get(interaction.commandName)

        if (command && command.autocompleteLogic) command.autocompleteLogic(this, interaction)
    }
}

type ComponentError = (Client: Client, interaction: ComponentInteractionTypes) => void
type ComponentDurationError = (Client: Client, interaction: ComponentInteractionTypes) => void
type CooldownError = (client: Client, interaction: CommandInteractionTypes, expireDate: Date) => void
