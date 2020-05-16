import { configure } from "mobx";
import NavigationStore from "../stores/domain/navigation.store";
import ArduinoStore from "../stores/domain/arduino.store";
import RoomStore from "../stores/domain/room.store";

export class RootStore {
    navigationStore: NavigationStore;
    arduinoStore: ArduinoStore;
    roomStore: RoomStore;

    constructor() {
        configure({ enforceActions: 'always' });
        this.navigationStore = new NavigationStore();
        this.arduinoStore = new ArduinoStore(this);
        this.roomStore = new RoomStore(this);
    }    
}

const rootStore = new RootStore();
export default rootStore;