const { EventBus } = require('./event-bus');
const { EventCreator } = require('./event-creator');
const { OnDataBakedEvent, OnDataReceivedEvent, OnSuccessEvent, OnErrorEvent } = require('./events');
const { RawDataProcessor } = require('./raw-date-processor');
const { BakedDataProcessor } = require('./baked-data-processor');
const { NotifierService } = require('./notifier-service');

const ENCODING = 'utf-8';
const DATA_EVENT_TYPE = 'data';
const NEW_LINE_SYMBOL = '\n';

const eventBus = new EventBus();
eventBus.registerEvent(OnDataReceivedEvent.name);
eventBus.registerEvent(OnDataBakedEvent.name);
eventBus.registerEvent(OnSuccessEvent.name);
eventBus.registerEvent(OnErrorEvent.name);

const eventCreator = new EventCreator(process.stdin, eventBus);
eventCreator.start(ENCODING, DATA_EVENT_TYPE);

const rawDataProcessor = new RawDataProcessor(eventBus);
rawDataProcessor.start();

const notifierService = new NotifierService(process.stdout, eventBus, NEW_LINE_SYMBOL);
notifierService.start();

const bakedDataProcessor = new BakedDataProcessor(eventBus);
bakedDataProcessor.start();