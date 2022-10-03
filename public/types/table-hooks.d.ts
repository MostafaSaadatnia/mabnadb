import { MabnaDBEventSet } from "./mabnaDB-event-set";
import { MabnaDBEvent } from "./mabnaDB-event";
import { Transaction } from "./transaction";
import { IndexableType } from "./indexable-type";

interface CreatingHookContext<T,Key> {
  onsuccess?: (primKey: Key) => void;
  onerror?: (err: any) => void;
}

interface UpdatingHookContext<T,Key> {
  onsuccess?: (updatedObj: T) => void;
  onerror?: (err: any) => void;
}

interface DeletingHookContext<T,Key> {
  onsuccess?: () => void;
  onerror?: (err: any) => void;
}

interface TableHooks<T=any,TKey=IndexableType> extends MabnaDBEventSet {
  (eventName: 'creating', subscriber: (this: CreatingHookContext<T,TKey>, primKey:TKey, obj:T, transaction:Transaction) => any): void;
  (eventName: 'reading', subscriber: (obj:T) => T | any): void;
  (eventName: 'updating', subscriber: (this: UpdatingHookContext<T,TKey>, modifications:Object, primKey:TKey, obj:T, transaction:Transaction) => any): void;
  (eventName: 'deleting', subscriber: (this: DeletingHookContext<T,TKey>, primKey:TKey, obj:T, transaction:Transaction) => any): void;
  creating: MabnaDBEvent;
  reading: MabnaDBEvent;
  updating: MabnaDBEvent;
  deleting: MabnaDBEvent;
}