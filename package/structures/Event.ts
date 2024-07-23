import { ClientEvents } from "discord.js";
import Client from './Client';

export default class Event<EventType extends keyof ClientEvents>{
    public event: EventType
    public once: boolean = false
    public logic?: EventLogic<EventType>

    constructor(event: EventType) {
        this.event = event
    }

    public setOnce(once: boolean) {
        this.once = once
        return this
    }

    public setLogic(logic: EventLogic<EventType>) {
        this.logic = logic
        return this
    }
}

type EventLogic<EventType extends keyof ClientEvents> = (client: Client, ...args: ClientEvents[EventType]) => void

let a = new Event("interactionCreate")
    .setLogic((client, int) => {
        return
    })