import { RootStore } from "../../core/store";
import { Port } from "../../models/port";
import { PortService } from "../../services/port.service";
import CrudStore from "./crud.store";

export default class ArduinoStore extends CrudStore<Port, number, PortService> {    
    constructor(rootStore: RootStore) {
        super(rootStore, new PortService(null));
    }
}