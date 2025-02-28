import mitt from 'mitt';

type Events = {
    refreshTimes: void;
};

const eventBus = mitt<Events>();

export default eventBus;
