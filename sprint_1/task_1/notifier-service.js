const { OnSuccessEvent, OnErrorEvent } = require('./events');

class NotifierService {
    /**
     * @param {import('stream').Writable} writable
     * @param {import('./event-bus').EventBus} eventBus
     * @param {import('./event-bus').EventBus} postfix
     */
    constructor(writable, eventBus, postfix) {
        this._writable = writable;
        this._eventBus = eventBus;
        this._postfix = postfix;
    }

    start() {
        this._eventBus.registerListener(
            OnSuccessEvent.name,
            (res) => {
                this._writable.write(res + this._postfix);
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

module.exports = {
    NotifierService
};
