import { AnySelectMenuInteraction, ButtonBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction, ModalBuilder, ModalSubmitInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, UserSelectMenuBuilder, UserSelectMenuInteraction } from 'discord.js';
import Client from './Client';

export default class Component<BuilderType extends BuilderTypes> {
    public client: Client
    public interactionId: string
    public logic?: ComponentLogicType<InteractionTypeFromBuilder<BuilderType>>
    private createdAt: number
    private maxUsageAmount: number
    private usageAmount: number
    private durationInSeconds: number

    public constructor(client: Client, interactionId: string) {
        this.client = client
        this.interactionId = interactionId

        const duplicateComponent = client.components.get(interactionId)

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
            client.components.set(interactionId, this)
        }
    }

    public setLogic(logic: ComponentLogicType<InteractionTypeFromBuilder<BuilderType>>): void {
        this.logic = logic
    }

    public setMaxDuration(durationInSeconds: number): Component<BuilderType> {
        this.durationInSeconds = durationInSeconds
        return this
    }

    public setMaxUsageAmount(maxUsageAmount: number): Component<BuilderType> {
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
        this.client.components.delete(this.interactionId)
    }
}

export type ComponentLogicType<InteractionType extends ComponentInteractionTypes> = (client: Client, interaction: InteractionType) => void
export type ComponentInteractionTypes = ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction

type BuilderTypes = ButtonBuilder | SelectMenuBuilder | ModalBuilder

type InteractionTypeFromBuilder<BuilderType extends BuilderTypes> =
    BuilderType extends ChannelSelectMenuBuilder ? ChannelSelectMenuInteraction :
    BuilderType extends StringSelectMenuBuilder ? StringSelectMenuInteraction :
    BuilderType extends UserSelectMenuBuilder ? UserSelectMenuInteraction :
    BuilderType extends RoleSelectMenuBuilder ? RoleSelectMenuInteraction :
    BuilderType extends SelectMenuBuilder ? AnySelectMenuInteraction :
    BuilderType extends ModalBuilder ? ModalSubmitInteraction :
    BuilderType extends ButtonBuilder ? ButtonInteraction :
    never

type BuilderTypeFromInteraction<InteractionType extends ComponentInteractionTypes> =
    InteractionType extends ChannelSelectMenuInteraction ? ChannelSelectMenuBuilder :
    InteractionType extends StringSelectMenuInteraction ? StringSelectMenuBuilder :
    InteractionType extends UserSelectMenuInteraction ? UserSelectMenuBuilder :
    InteractionType extends RoleSelectMenuInteraction ? RoleSelectMenuBuilder :
    InteractionType extends AnySelectMenuInteraction ? SelectMenuBuilder :
    InteractionType extends ModalSubmitInteraction ? ModalBuilder :
    InteractionType extends ButtonInteraction ? ButtonBuilder :
    never;