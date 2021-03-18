const fs = require('fs');
const { pipeline } = require('stream');
const csv = require('csvtojson');

class PipelineManager {
    /**
     * 
     * @param {string} input 
     * @param {string} output 
     * @param {(err: Error) => void} handler 
     */
    process(input, output, handler) {
        pipeline(
            csv().fromStream(
                fs.createReadStream(input).on('error', handler)
            ),
            fs.createWriteStream(output),
            handler
        );
    }
}

module.exports = {
    PipelineManager
};
