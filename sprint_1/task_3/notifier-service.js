import { OnSuccessEvent, OnErrorEvent } from './events';

export class NotifierService {
    /**
     * @param {import('stream').Writable} writable
     * @param {import('./event-bus').EventBus} eventBus
     */
    constructor(writable, eventBus, postfix) {
        this._writable = writable;
        this._eventBus = eventBus;
        this._postfix = postfix;
    }

    start() {
        this._eventBus.registerListener(
            OnSuccessEvent.name,
            (data) => {
                this._writable.write(data + this._postfix);
            }
        );
        this._eventBus.registerListener(
            OnErrorEvent.name,
            /**
             * @param {Error} err 
             */
            (err) => {
                this._writable.write(err + this._postfix);
            }
        );
    }
}
