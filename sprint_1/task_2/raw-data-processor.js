const { OnDataReceivedEvent, OnDataBakedEvent } = require('./events');

class RawDataProcessor {
    /**
     * @param {import('./event-bus').EventBus} eventBus
     */
    constructor(eventBus) {
        this._eventBus = eventBus;
    }

    start() {
        this._eventBus.registerListener(OnDataReceivedEvent.name, this.handler.bind(this));
    }

    /**
     * @param {string} data
     */
    handler(data) {
        data = this.prepareData(data);
        this._eventBus.publish(new OnDataBakedEvent(data));
    }

    /**
     * 
     * @param {string} data
     */
    prepareData(data) {
        return data.replace(/\r?\n|\r/g, '');
    }
}

module.exports = {
    RawDataProcessor
};
