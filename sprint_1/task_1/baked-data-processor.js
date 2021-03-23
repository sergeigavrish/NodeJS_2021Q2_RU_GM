const { OnDataBakedEvent, OnErrorEvent, OnSuccessEvent } = require('./events');

class BakedDataProcessor {
    /**
     * @param {import('./event-bus').EventBus} eventBus
     */
    constructor(eventBus) {
        this._eventBus = eventBus;
    }

    start() {
        this._eventBus.registerListener(OnDataBakedEvent.name, this.handler.bind(this));
    }

    /**
     * @param {string} data
     */
    handler(data) {
        try {
            if (data.length < 2) {
                return this._eventBus.publish(new OnSuccessEvent(data));
            }
            const res = [];
            for (let left = 0, right = data.length - 1; left <= right; left++, right--) {
                res[left] = data[right];
                res[right] = data[left];
            }
            this._eventBus.publish(new OnSuccessEvent(res.join('')));

        } catch (error) {
            this._eventBus.publish(new OnErrorEvent(error.message));
        }
    }
}

module.exports = {
    BakedDataProcessor
};
