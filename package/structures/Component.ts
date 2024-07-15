import { ButtonInteraction, Interaction as DjsInteraction, ModalSubmitInteraction } from "discord.js";
import { v4 } from "uuid";
import Client from "./Client";
import { SelectMenuTypes } from "./SelectMenu";

export default class Component<T extends ComponentTypes<unknown>> {
    public id: string
    public limits: ComponentLimits
    public createdAt: number
    public usageCount: number
    public logic?: (client: Client, interaction: T) => void

    constructor(limits: ComponentLimits = {}) {
        const idFlags = `${limits.maxDurationSec && limits.maxDurationSec > 0 ? 't' : 'n'}${limits.maxUsageAmount && limits.maxUsageAmount > 0 ? 'd' : 'n'}`
        this.id = idFlags + v4()
        this.limits = limits
        this.createdAt = Date.now()
        this.usageCount = 0
    }

    setLogic(logic: (client: Client, interaction: T) => void) {
        this.logic = logic
    }
}

export interface ComponentLimits {
    maxDurationSec?: number
    maxUsageAmount?: number
    guildOnly?: boolean
}

export interface ComponentErrors {
    maxDurationError?: (client: Client, interaction: DjsInteraction) => void,
    maxUsageError?: (client: Client, interaction: DjsInteraction) => void,
    undefinedError?: (client: Client, interaction: DjsInteraction) => void
}

export type ComponentTypes<T> = ButtonInteraction | SelectMenuTypes<T> | ModalSubmitInteraction