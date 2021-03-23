const EventEmitter = require('events');

/**
 * @typedef IEvent
 * @property {*} data
 * @property {string} type
 */

/**
 * @callback EventCtor
 * @param {*} data
 * @returns {IEvent}
 * */

class EventBus extends EventEmitter {
    constructor() {
        super();
        /**
         * @type {Set<string>}
         * */
        this._eventTypes = new Set();
    }

    /**
     * @param {string} type
     */
    registerEvent(type) {
        this._eventTypes.add(type);
    }


    /**
     * @param {string} type
     * @param {Function} callback
     */
    registerListener(type, callback) {
        if (this._eventTypes.has(type)) {
            this.addListener(type, callback);
        }
    }

    /**
     * @param {IEvent} event
     */
    publish(event) {
        if (this._eventTypes.has(event.type)) {
            this.emit(event.type, event.data);
        }
    }
}

module.exports = {
    EventBus
};
