import { ButtonStyle, ButtonBuilder as DjsButtonBuilder } from 'discord.js';

export default class ButtonBuilder extends DjsButtonBuilder {
    constructor(...args: ConstructorParameters<typeof DjsButtonBuilder>) {
        super(...args)
        this.data.style = ButtonStyle.Secondary
    }

    public setReference(button: DjsButtonBuilder) {
        Object.assign(this.data, button.data)
        return this
    }
}