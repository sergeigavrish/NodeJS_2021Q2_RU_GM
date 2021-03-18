import { EventBus } from './event-bus';
import { OnDataReceivedEvent, OnDataBakedEvent, OnErrorEvent, OnSuccessEvent } from './events';
import { EventCreator } from './event-creator';
import { RawDataProcessor } from './raw-data-processor';
import { PipelineManager } from './pipeline-manager';
import { NotifierService } from './notifier-service';
import { Strategy } from './strategy';
import { ReverseStringRule, ConvertCsvRule } from './rules';
import { BakedDataProcessor } from './baked-data-processor';

const ENCODING = 'utf-8';
const DATA_EVENT_TYPE = 'data';
const NEW_LINE_SYMBOL = '\n';
const REVERSE_COMMAND = 'reverse';
const CONVERT_COMMAND = 'convert';

const eventBus = new EventBus();
eventBus.registerEvent(OnDataReceivedEvent.name);
eventBus.registerEvent(OnDataBakedEvent.name);
eventBus.registerEvent(OnErrorEvent.name);
eventBus.registerEvent(OnSuccessEvent.name);

const eventCreator = new EventCreator(process.stdin, eventBus);
eventCreator.start(ENCODING, DATA_EVENT_TYPE);

const notifierService = new NotifierService(process.stdout, eventBus, NEW_LINE_SYMBOL);
notifierService.start();


const pipelineManager = new PipelineManager();
const strategy = new Strategy(eventBus);
strategy.registerRule(REVERSE_COMMAND, new ReverseStringRule());
strategy.registerRule(CONVERT_COMMAND, new ConvertCsvRule(pipelineManager));

const rawDataProcessor = new RawDataProcessor(eventBus);
rawDataProcessor.start();
const bakedDataProcessor = new BakedDataProcessor(eventBus, strategy);
bakedDataProcessor.start();
