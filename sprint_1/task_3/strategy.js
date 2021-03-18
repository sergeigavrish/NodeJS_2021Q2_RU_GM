import { OnSuccessEvent, OnErrorEvent } from './events';

/**
 * @typedef IRule
 * @property {(...data: *[]) => Promise<*>} run
 */

 export class Strategy {
    /**
     * 
     * @param {import('./event-bus').EventBus} eventBus 
     */
    constructor(eventBus) {
        /**
         * @type {Map<string, IRule>}
         */
        this._map = new Map();
        this._eventBus = eventBus;
    }

    /**
     * 
     * @param {string} type 
     * @param {IRule} rule 
     */
    registerRule(type, rule) {
        this._map.set(type, rule);
    }

    /**
     * 
     * @param {string} type 
     * @param {*[]} data 
     * @returns 
     */
    run(type, data) {
        const rule = this._map.get(type);
        if (!rule) {
            return this._eventBus.publish(new OnErrorEvent(`${type} rule doesn't exist`));
        }
        rule.run(...data)
            .then(res => {
                this._eventBus.publish(new OnSuccessEvent(res))
            })
            .catch(err => {
                this._eventBus.publish(new OnErrorEvent(err.message))
            });
    }
}
