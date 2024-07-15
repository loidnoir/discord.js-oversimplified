import { User, UserSelectMenuBuilder, UserSelectMenuInteraction } from "discord.js";
import Client from "./Client";
import { ComponentLimits } from "./Component";
import SelectMenu, { SelectMenuPreferences, SelectMenuTypes } from "./SelectMenu";

export default class UserSelectMenu extends SelectMenu<string, SelectMenuPreferences> {
    constructor(client: Client, preferences?: SelectMenuPreferences, limits?: ComponentLimits) {
        super(client, preferences, limits)
    }

    public addDefaultUsers(...options: User[] | string[]) {
        for (const option of options) {
            if (typeof option == 'string') this.options.push(option)
            else this.options.push(option.id)
        }
    }

    public getData() {
        const selectMenu = new UserSelectMenuBuilder()
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

        if (this.options.length > 0) {
            selectMenu.addDefaultUsers(this.options)
        }

        return selectMenu
    }

    setLogic(logic: (client: Client, interaction: SelectMenuTypes<UserSelectMenuInteraction>) => void): void {
        super.setLogic(logic)
    }
}