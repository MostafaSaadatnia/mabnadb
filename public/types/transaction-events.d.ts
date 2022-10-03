import { MabnaDBEvent } from "./mabnaDB-event";
import { MabnaDBEventSet } from "./mabnaDB-event-set";

export interface TransactionEvents extends MabnaDBEventSet {
  (eventName: 'complete', subscriber: () => any): void;
  (eventName: 'abort', subscriber: () => any): void;
  (eventName: 'error', subscriber: (error:any) => any): void;
  complete: MabnaDBEvent;
  abort: MabnaDBEvent;
  error: MabnaDBEvent;
}    