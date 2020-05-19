import DateTimePicker from '@react-native-community/datetimepicker';
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import { Body, Button, Container, Content, ListItem, Right, Switch, Text, View, Spinner } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import { Subject, from } from 'rxjs';
import { Schedule } from "../../models/schedule";
import RoomStore from '../../stores/domain/room.store';
import ScheduleStore from '../../stores/domain/schedule.store';
import { toStream } from 'mobx-utils';
import { take, takeUntil } from 'rxjs/operators';
import { CrudState } from '../../stores/domain/crud.store';

export interface DetailProps {
    navigation?: NavigationScreenProp<any, any>;
    roomStore?: RoomStore;
    scheduleStore?: ScheduleStore;
}

@inject((stores: any) => ({
    roomStore: stores.rootStore.roomStore,
    arduinoStore: stores.rootStore.arduinoStore,
    scheduleStore: stores.rootStore.scheduleStore
}))

@observer
export default class DetailComponent extends React.Component<DetailProps> {
    destroy$: Subject<void> = new Subject<void>();
    disabledStyle = { backgroundColor: "red", color: "red" };

    constructor(props: Readonly<DetailProps>){
        super(props);
        this.props.roomStore.reset("entity");
        let id = this.props.navigation.getParam("id", null);
        id && this.props.roomStore.getRoomAndSchedule(id); 
                
    }
   
    @observable showTime: boolean = false;
    @observable pickerState: "startAt" | "endAt";

    componentDidMount(): void {
        
    }

    componentWillUnmount(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @action
    showTimePicker(state: "startAt" | "endAt") {
        this.pickerState = state;
        this.showTime = !this.showTime;
    }

    @action
    setTime(event: any) {
        let { entity } = this.props.scheduleStore;
        let date = entity[this.pickerState];
        let timestamp = event && event?.nativeEvent?.timestamp ? event.nativeEvent.timestamp : null;
        timestamp && (date = new Date(timestamp));
        
        let model = Object.assign({}, entity, { [this.pickerState]: date });
        this.props.scheduleStore.setEntity(model);
        this.showTime = !this.showTime;
    }

    dateToStringTime(date: any){
        if(!(date instanceof Date))
            date = new Date(date);

        let hour: any = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        let minute: any = date.getMinutes();
        minute = minute < 10 ? "0" + minute: minute;
        return hour + ":" + minute;
    }

    toTimestamp(strDate){
        var datum = Date.parse(strDate);
        return datum/1000;
    }
     

    @action
    submit() {
        let schedule: any = Object.assign({},this.props.scheduleStore.entity);
        let room = this.props.roomStore.entity;
        schedule.fkRoomId = room.id;
        this.props.scheduleStore.saveSchedule(room, schedule) ;
        from(toStream(() => this.props.scheduleStore.state))
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(res => {
            if (res === CrudState.Done) {
                this.props.navigation.goBack();
            }
        });
    }

    @action
    toggleIsActive(): void {
        let entity = Object.assign({},this.props.roomStore.entity);
        entity.isSchedule = !entity.isSchedule;

        let style = { backgroundColor: "#ebebeb" , color: "#606060" };
        this.disabledStyle = entity.isSchedule ? style : { backgroundColor: "" , color: "" };

        this.props.roomStore.setEntity(entity);        
    }

    render() {
        let {entity} = this.props.roomStore;
        let scheduleEntity = this.props.scheduleStore.entity;
        let { state } = this.props.scheduleStore;

        console.log("render");
        return (
            <Container>
                <Content>
                    <ListItem>
                        <Body>
                            <Text>Gunakan Schedule</Text>
                        </Body>
                        <Right>
                            <Switch value={entity && entity?.isSchedule} onValueChange={status => this.toggleIsActive()} />
                        </Right>
                    </ListItem>
                    <View style={{ backgroundColor: entity && entity.isSchedule ? "white" : "#ebebeb" }}>
                        <ListItem >
                            <Body>
                                <Text style={{ color: entity && entity.isSchedule ? "black" : "#606060" }}>Waktu Menyala</Text>
                            </Body>
                            <Right>
                                <Button badge small onPress={() => this.showTimePicker("startAt")} transparent color="primary">
                                    <Text style={{  color: entity && entity.isSchedule ? "blue" : "#606060" }}>
                                        {scheduleEntity && Boolean(scheduleEntity.startAt) && this.dateToStringTime(scheduleEntity.startAt)}</Text>
                                </Button>
                            </Right>
                        </ListItem>
                    </View>
                    <View style={{ backgroundColor: entity && entity.isSchedule ? "white" : "#ebebeb" }}>
                        <ListItem>
                            <Body>
                                <Text style={{ color: entity && entity.isSchedule ? "black" : "#606060" }}>Waktu Padam</Text>
                            </Body>
                            <Right>
                                <Button badge small onPress={() => this.showTimePicker("endAt")} transparent color="primary">
                                    <Text style={{ color: entity && entity.isSchedule ? "blue" : "#606060" }}>
                                        {scheduleEntity && Boolean(scheduleEntity.endAt) && this.dateToStringTime(scheduleEntity.endAt)}
                                    </Text>
                                </Button>
                            </Right>
                        </ListItem>
                    </View>
                    {this.showTime && 
                    <View>
                        <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={new Date()}
                        mode={"time"}
                        is24Hour={true}
                        display="default"
                                                
                        onChange={e => this.setTime(e)} />
                    </View>}

                    <View padder style={{ zIndex: 1, }} >
                        <Button rounded primary
                            style={{ marginTop: 10, justifyContent: 'center', backgroundColor: "green" }}
                            onPress={() => { this.submit() }}>
                            
                            <Text>Save</Text>
                            <Spinner size="small" animating={state === CrudState.Submitting}/>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
