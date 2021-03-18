class OnDataReceivedEvent {
    get type() {
        return OnDataReceivedEvent.name;
    }

    get data() {
        return this._data;
    }

    constructor(data) {
        this._data = data;
    }
}

class OnDataBakedEvent {
    get type() {
        return OnDataBakedEvent.name;
    }

    get data() {
        return this._data;
    }

    constructor(data) {
        this._data = data;
    }
}

class OnSuccessEvent {
    get type() {
        return OnSuccessEvent.name;
    }

    constructor() { }
}

class OnErrorEvent {
    get type() {
        return OnErrorEvent.name;
    }

    get data() {
        return this._data;
    }

    constructor(data) {
        this._data = data;
    }
}

module.exports = {
    OnDataReceivedEvent,
    OnDataBakedEvent,
    OnErrorEvent,
    OnSuccessEvent
};
