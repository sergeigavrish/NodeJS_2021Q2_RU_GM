const { OnDataReceivedEvent } = require('./events');

class EventCreator {
    /**
     * 
     * @param {Readable} readable
     * @param {import('./event-bus').EventBus} eventBus
     */
    constructor(
        readable,
        eventBus,
    ) {
        this._readable = readable;
        this._eventBus = eventBus;
    }

    /**
     * @param {string} encoding
     * @param {string} type
     */
    start(encoding, type) {
        this._readable.setEncoding(encoding);
        this._readable.on(type, this.handler.bind(this));
    }

    /**
     * @param {string} data
     */
    handler(data) {
        this._eventBus.publish(new OnDataReceivedEvent(data))
    }
}

module.exports = {
    EventCreator
};
