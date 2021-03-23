const { OnDataBakedEvent, OnSuccessEvent, OnErrorEvent } = require('./events');

class BakedDataProcessor {
    /**
     * @param {import('./pipeline-manager').PipelineManager} pipelineManager
     * @param {import('./event-bus').EventBus} eventBus
     */
    constructor(
        pipelineManager,
        eventBus
    ) {
        this._pipelineManager = pipelineManager;
        this._eventBus = eventBus;
    }

    start() {
        this._eventBus.registerListener(OnDataBakedEvent.name, this.handler.bind(this));
    }

    /**
     * @param {string} data
     */
    handler(data) {
        const [inputPath, outputPath] = data.split(' ');
        if (!inputPath) {
            return this._eventBus.publish(new OnErrorEvent('pass input file path as a first argument'));
        }
        if (!outputPath) {
            return this._eventBus.publish(new OnErrorEvent('pass output file path as a second argument'));
        }
        this._pipelineManager.process(
            inputPath,
            outputPath,
            err => this.pipelineHandler(err)
        );
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

module.exports = {
    BakedDataProcessor
};
