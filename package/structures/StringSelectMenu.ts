import { StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import Client from "./Client";
import { ComponentLimits } from "./Component";
import SelectMenu, { SelectMenuPreferences, SelectMenuTypes } from "./SelectMenu";

export default class StringSelectMenu extends SelectMenu<StringSelectMenuOptionBuilder, StringSelectMenuPreferences> {
    constructor(client: Client, preferences?: StringSelectMenuPreferences, limits?: ComponentLimits) {
        super(client, preferences, limits)
    }

    public addOption(...options: StringSelectMenuOptionBuilder[]) {
        for (const option of options) {
            this.options.push(option)
        }
    }

    public getData() {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(this.id)

        if (this.preferences?.disabled) {
            selectMenu.setDisabled(true)
        } 

        if (this.preferences?.maxValues) {
            selectMenu.setMaxValues(this.preferences.maxValues)
        }

        if (this.preferences?.minValues) {
            selectMenu.setMinValues(this.preferences.minValues)
        }

        if (this.preferences?.placeholder) {
            selectMenu.setPlaceholder(this.preferences.placeholder)
        }

        selectMenu.addOptions(this.options)

        return selectMenu
    }

    setLogic(logic: (client: Client, interaction: SelectMenuTypes<StringSelectMenuInteraction>) => void): void {
        super.setLogic(logic)
    }
}

interface StringSelectMenuPreferences extends SelectMenuPreferences {
    placeholder?: string
}