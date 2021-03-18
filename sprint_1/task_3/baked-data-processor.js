import { OnDataBakedEvent, OnSuccessEvent, OnErrorEvent } from './events';

export class BakedDataProcessor {
    /**
     * @param {import('./event-bus').EventBus} eventBus
     * @param {import('./strategy').Strategy} strategy
     */
    constructor(
        eventBus,
        strategy
    ) {
        this._eventBus = eventBus;
        this._strategy = strategy;
    }

    start() {
        this._eventBus.registerListener(OnDataBakedEvent.name, this.handler.bind(this));
    }

    /**
     * @param {string} data
     */
    handler(data) {
        const [cmd, ...args] = data.split(' ');
        this._strategy.run(cmd, args);
    }

    /**
     * @param {Error} err 
     */
    pipelineHandler(err) {
        if (err) {
            this._eventBus.publish(new OnErrorEvent(err.message));
        } else {
            this._eventBus.publish(new OnSuccessEvent());
        }
    }
}
