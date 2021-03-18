import fs from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';
import util from 'util';

const asyncPipeline = util.promisify(pipeline);

export class PipelineManager {
    /**
     * @param {string} input 
     * @param {string} output
     * @returns {Promise}
     */
    process(input, output) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(input).on('error', reject);
            const writeStream = fs.createWriteStream(output).on('error', reject);
            return asyncPipeline(
                csv().fromStream(readStream),
                writeStream
            )
                .then(resolve, reject);

        });
    }
}
