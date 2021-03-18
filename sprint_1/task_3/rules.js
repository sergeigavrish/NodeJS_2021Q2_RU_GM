export class ReverseStringRule {
    /**
     * 
     * @param {string[]} data
     * @returns {Promise}
     */
    async run(data) {
        try {
            if (data.length < 2) {
                return data;
            }
            const res = [];
            for (let left = 0, right = data.length - 1; left <= right; left++, right--) {
                res[left] = data[right];
                res[right] = data[left];
            }
            return res.join('');
        } catch (error) {
            throw error;
        }
    }
}

export class ConvertCsvRule {
    /**
     * @param {import('./pipeline-manager').PipelineManager} pipelineManager 
     */
    constructor(
        pipelineManager
    ) {
        this._pipelineManager = pipelineManager;
    }

    /**
     * 
     * @param {string[]} data
     * @returns {Promise}
     */
    async run(inputPath, outputPath) {
        try {
            if (!inputPath) {
                throw new Error('pass input file path as a first argument');
            }
            if (!outputPath) {
                throw new Error('pass output file path as a second argument');
            }
            return this._pipelineManager.process(inputPath, outputPath).then(() => 'process was ended successfully');
        } catch (error) {
            throw error;
        }
    }
}
