import { AnySelectMenuInteraction, ButtonBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, UserSelectMenuBuilder, UserSelectMenuInteraction } from 'discord.js';
import Client from './Client';

export default class Component<ComponentType extends ComponentTypes> {
    public client: Client
    public component: ComponentType
    public customId: string
    public logic?: LogicType<InteractionType<ComponentType>>
    private createdAt: number
    private maxUsageAmount: number
    private usageAmount: number
    private durationInSeconds: number

    constructor(client: Client, component: ComponentType, customId: string) {
        this.client = client
        this.component = component
        this.customId = customId

        const duplicateComponent = client.components.get(customId)

        if (duplicateComponent) {
            this.createdAt = duplicateComponent.createdAt
            this.usageAmount = duplicateComponent.usageAmount
            this.durationInSeconds = duplicateComponent.durationInSeconds
            this.maxUsageAmount = duplicateComponent.maxUsageAmount
        }

        else {
            this.createdAt = Date.now()
            this.usageAmount = 0
            this.durationInSeconds = 0
            this.maxUsageAmount = 0
            client.components.set(customId, this)
        }
    }

    public execute(logic: LogicType<InteractionType<ComponentType>>): void {
        this.logic = logic
    }

    public setMaxDuration(durationInSeconds: number): Component<ComponentType> {
        this.durationInSeconds = durationInSeconds
        return this
    }

    public setMaxUsageAmount(maxUsageAmount: number): Component<ComponentType> {
        this.maxUsageAmount = maxUsageAmount
        return this
    }

    public isExpired(): boolean {
        if (this.createdAt + (this.durationInSeconds * 1000) <= Date.now() && this.durationInSeconds > 0) return true 
        if (this.usageAmount >= this.maxUsageAmount && this.maxUsageAmount > 0) return true
        return false
    }

    public addUsage(amount: number): void {
        this.usageAmount += amount
    }

    public delete(): void {
        this.client.components.delete(this.customId)
    }
}

export type LogicType<InteractionType> = (client: Client, interaction: InteractionType) => void

export type ComponentTypes = ButtonBuilder | SelectMenuBuilder | ModalBuilder

export type InteractionType<ComponentType> =
    ComponentType extends ButtonBuilder ? ButtonInteraction :
    ComponentType extends StringSelectMenuBuilder ? StringSelectMenuInteraction :
    ComponentType extends UserSelectMenuBuilder ? UserSelectMenuInteraction :
    ComponentType extends RoleSelectMenuBuilder ? RoleSelectMenuInteraction :
    ComponentType extends ChannelSelectMenuBuilder ? ChannelSelectMenuInteraction :
    ComponentType extends SelectMenuBuilder ? AnySelectMenuInteraction :
    ComponentType extends ModalBuilder ? ModalSubmitInteraction :
    never