import { Role, RoleSelectMenuBuilder, RoleSelectMenuInteraction } from "discord.js";
import Client from "./Client";
import { ComponentLimits } from "./Component";
import SelectMenu, { SelectMenuPreferences, SelectMenuTypes } from "./SelectMenu";

export default class RoleSelectMenu extends SelectMenu<string, SelectMenuPreferences> {
    constructor(client: Client, preferences?: SelectMenuPreferences, limits?: ComponentLimits) {
        super(client, preferences, limits)
    }

    public addDefaultRoles(...options: Role[] | string[]) {
        for (const option of options) {
            if (typeof option == 'string') this.options.push(option)
            else this.options.push(option.id)
        }
    }

    public getData() {
        const selectMenu = new RoleSelectMenuBuilder()
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
            selectMenu.setDefaultRoles(this.options)
        }

        return selectMenu
    }

    setLogic(logic: (client: Client, interaction: SelectMenuTypes<RoleSelectMenuInteraction>) => void): void {
        super.setLogic(logic)
    }
}