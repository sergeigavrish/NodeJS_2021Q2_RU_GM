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
            () => {
                this._writable.write('process was ended successfully\n');
            }
        );
        this._eventBus.registerListener(
            OnErrorEvent.name,
            /**
             * @param {Error} err 
             */
            (err) => {
                this._writable.write(err + '\n');
            }
        );
    }
}

module.exports = {
    NotifierService
};
