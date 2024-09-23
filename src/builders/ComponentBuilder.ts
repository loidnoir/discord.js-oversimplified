import {
    AnySelectMenuInteraction,
    BaseSelectMenuBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ModalBuilder,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction,
} from 'discord.js'
import Client from '../structures/Client'

export default class ComponentBuilder<BuilderType extends ComponentBuilderTypes> {
    private readonly client: Client
    private readonly interactionId: string
    private readonly createdAt: number

    public logic?: ComponentLogicType<ComponentInteractionTypeFromBuilder<BuilderType>>

    private usageCounter: number
    private maxUsageAmount: number
    private maxDuration: number

    public constructor(client: Client, interactionId: string) {
        this.client = client
        this.interactionId = interactionId

        const duplicateComponent = client.components.get(interactionId)

        if (duplicateComponent) {
            this.createdAt = duplicateComponent.createdAt
            this.usageCounter = duplicateComponent.usageCounter
            this.maxDuration = duplicateComponent.maxDuration
            this.maxUsageAmount = duplicateComponent.maxUsageAmount
        } else {
            this.createdAt = Date.now()
            this.usageCounter = 0
            this.maxDuration = 0
            this.maxUsageAmount = 0
            client.components.set(interactionId, this)
        }
    }

    public setLogic(logic: ComponentLogicType<ComponentInteractionTypeFromBuilder<BuilderType>>): this {
        this.logic = logic
        return this
    }

    public setDuration(durationInSeconds: number): this {
        this.maxDuration = durationInSeconds
        return this
    }

    public setUsageLimit(maxUsageAmount: number): this {
        this.maxUsageAmount = maxUsageAmount
        return this
    }

    public isExpired(): boolean {
        const isDurationExpired = this.maxDuration > 0 && this.createdAt + this.maxDuration * 1000 <= Date.now()
        const isUsageExceeded = this.maxUsageAmount > 0 && this.usageCounter >= this.maxUsageAmount
        return isDurationExpired || isUsageExceeded
    }

    public addUsage(amount: number): this {
        this.usageCounter += amount
        return this
    }

    public delete(): void {
        this.client.components.delete(this.interactionId)
    }
}

export type ComponentInteractionTypes = ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction
export type ComponentBuilderTypes = ButtonBuilder | BaseSelectMenuBuilder<any> | ModalBuilder

export type ComponentLogicType<InteractionType extends ComponentInteractionTypes> = (
    client: Client,
    interaction: InteractionType
) => void

export type ComponentInteractionTypeFromBuilder<BuilderType extends ComponentBuilderTypes> =
    BuilderType extends ChannelSelectMenuBuilder
        ? ChannelSelectMenuInteraction
        : BuilderType extends StringSelectMenuBuilder
          ? StringSelectMenuInteraction
          : BuilderType extends UserSelectMenuBuilder
            ? UserSelectMenuInteraction
            : BuilderType extends RoleSelectMenuBuilder
              ? RoleSelectMenuInteraction
              : BuilderType extends BaseSelectMenuBuilder<any>
                ? AnySelectMenuInteraction
                : BuilderType extends ModalBuilder
                  ? ModalSubmitInteraction
                  : BuilderType extends ButtonBuilder
                    ? ButtonInteraction
                    : never

export type ComponentBuilderTypeFromInteraction<InteractionType extends ComponentInteractionTypes> =
    InteractionType extends ChannelSelectMenuInteraction
        ? ChannelSelectMenuBuilder
        : InteractionType extends StringSelectMenuInteraction
          ? StringSelectMenuBuilder
          : InteractionType extends UserSelectMenuInteraction
            ? UserSelectMenuBuilder
            : InteractionType extends RoleSelectMenuInteraction
              ? RoleSelectMenuBuilder
              : InteractionType extends AnySelectMenuInteraction
                ? BaseSelectMenuBuilder<any>
                : InteractionType extends ModalSubmitInteraction
                  ? ModalBuilder
                  : InteractionType extends ButtonInteraction
                    ? ButtonBuilder
                    : never
