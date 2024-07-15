import { ChannelSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js"
import Client from "./Client"
import Component, { ComponentLimits } from "./Component"

export default class SelectMenu<T, P> extends Component<SelectMenuTypes<T>> {
    public preferences?: P
    protected options: T[] = []

    constructor(client: Client, preferences?: P, limits?: ComponentLimits) {
        super(limits)
        this.preferences = preferences
        client.components.set(this.id, this)
    }

    setLogic<T>(logic: (client: Client, interaction: SelectMenuTypes<T>) => void): void {
        super.setLogic(logic)
    }
}

export interface SelectMenuPreferences {
    maxValues?: number,
    minValues?: number,
    disabled?: boolean
}

export type SelectMenuTypes<T> = StringSelectMenuInteraction | UserSelectMenuInteraction | ChannelSelectMenuInteraction | RoleSelectMenuInteraction