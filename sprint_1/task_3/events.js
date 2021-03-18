export class OnDataReceivedEvent {
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

export class OnDataBakedEvent {
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

export class OnSuccessEvent {
    get type() {
        return OnSuccessEvent.name;
    }

    get data() {
        return this._data;
    }

    constructor(data) {
        this._data = data;
    }
}

export class OnErrorEvent {
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
