import { ChannelSelectMenuBuilder, ChannelType, GuildChannel, UserSelectMenuInteraction } from "discord.js";
import Client from "./Client";
import { ComponentLimits } from "./Component";
import SelectMenu, { SelectMenuPreferences, SelectMenuTypes } from "./SelectMenu";

export default class ChannelSelectMenu extends SelectMenu<string, ChannelSelectMenuPreferences> {
    constructor(client: Client, preferences?: ChannelSelectMenuPreferences, limits?: ComponentLimits) {
        super(client, preferences, limits)
    }

    public addDefaultChannels(...options: GuildChannel[] | string[]) {
        for (const option of options) {
            if (typeof option == 'string') this.options.push(option)
            else this.options.push(option.id)
        }
    }

    public getData() {
        const selectMenu = new ChannelSelectMenuBuilder()
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

        if (this.preferences?.channelTypes && this.preferences?.channelTypes.length > 0) {
            selectMenu.addChannelTypes(this.preferences.channelTypes)
        }

        if (this.options.length > 0) {
            selectMenu.addDefaultChannels(this.options)
        }

        return selectMenu
    }

    setLogic(logic: (client: Client, interaction: SelectMenuTypes<UserSelectMenuInteraction>) => void): void {
        super.setLogic(logic)
    }
}

interface ChannelSelectMenuPreferences extends SelectMenuPreferences {
    channelTypes: ChannelType[]
}