const { EventBus } = require('./event-bus');
const { OnDataReceivedEvent, OnDataBakedEvent, OnErrorEvent, OnSuccessEvent } = require('./events');
const { EventCreator } = require('./event-creator');
const { RawDataProcessor } = require('./raw-data-processor');
const { BakedDataProcessor } = require('./baked-data-processor');
const { PipelineManager } = require('./pipeline-manager');
const { NotifierService } = require('./notifier-service');

const ENCODING = 'utf-8';
const DATA_EVENT_TYPE = 'data';
const NEW_LINE_SYMBOL = '\n';

const eventBus = new EventBus();
eventBus.registerEvent(OnDataReceivedEvent.name);
eventBus.registerEvent(OnDataBakedEvent.name);
eventBus.registerEvent(OnErrorEvent.name);
eventBus.registerEvent(OnSuccessEvent.name);

const eventCreator = new EventCreator(process.stdin, eventBus);
eventCreator.start(ENCODING, DATA_EVENT_TYPE);

const rawDataProcessor = new RawDataProcessor(eventBus);
rawDataProcessor.start();

const notifierService = new NotifierService(process.stdout, eventBus, NEW_LINE_SYMBOL);
notifierService.start();

const pipelineManager = new PipelineManager();
const bakedDataProcessor = new BakedDataProcessor(pipelineManager, eventBus);
bakedDataProcessor.start();
