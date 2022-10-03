import { MabnaDBEvent } from "./mabnaDB-event";

export interface MabnaDBEventSet {
    (eventName: string): MabnaDBEvent; // To be able to unsubscribe.

    addEventType(
        eventName: string,
        chainFunction?: (f1: Function, f2: Function) => Function,
        defaultFunction?: Function): MabnaDBEvent;
    addEventType(
        events: { [eventName: string]: ('asap' | [(f1: Function, f2: Function) => Function, Function]) })
        : MabnaDBEvent;
}