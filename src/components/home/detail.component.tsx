import DateTimePicker from '@react-native-community/datetimepicker';
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import { Body, Button, Container, Content, ListItem, Right, Switch, Text, View } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import { Schedule } from "../../models/schedule";

export interface DetailProps {
    navigation?: NavigationScreenProp<any, any>,
}

@observer
export default class DetailComponent extends React.Component<DetailProps> {
   
    constructor(props: Readonly<DetailProps>){
        super(props);
    }
    @observable showTime: boolean = false;
    @observable model: Schedule = {
        startAt: new Date(),
        endAt: new Date
    }
    @observable pickerState: "startAt" | "endAt";

    componentDidMount(): void {

    }

    @action
    showTimePicker(state: "startAt" | "endAt") {
        this.pickerState = state;
        this.showTime = !this.showTime;
    }

    @action
    setTime(event: any) {
        let date = this.model[this.pickerState];
        let timestamp = event && event?.nativeEvent?.timestamp ? event.nativeEvent.timestamp : null;
        timestamp && (date = new Date(timestamp))

        this.model[this.pickerState] = date;
        this.showTime = !this.showTime;
    }

    dateToStringTime(date: Date){
        let hour: any = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        let minute: any = date.getMinutes();
        minute = minute < 10 ? "0" + minute: minute;
        return hour + ":" + minute;
    }

    submit(){

    }

    render() {
        console.log("render detail");
        return (
            <Container>
                <Content>
                    <ListItem>
                        <Body>
                            <Text>Gunakan Schedule</Text>
                        </Body>
                        <Right>
                            <Switch value={true} />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text>Waktu Menyala</Text>
                        </Body>
                        <Right>
                            <Button badge small onPress={() => this.showTimePicker("startAt")} transparent color="primary">
                                <Text style={{color:"blue"}}>{this.dateToStringTime(this.model.startAt)}</Text>
                            </Button>
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text>Waktu Padam</Text>
                        </Body>
                        <Right>
                            <Button badge small onPress={() => this.showTimePicker("endAt")} transparent color="primary">
                                <Text style={{color:"blue"}}>{this.dateToStringTime(this.model.endAt)}</Text>
                            </Button>
                        </Right>
                    </ListItem>
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
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
