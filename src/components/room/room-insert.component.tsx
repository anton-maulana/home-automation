import { inject, observer } from "mobx-react";
import { Container, Content, Form, Icon, Input, Item, Text, View, Picker, Button, Spinner } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import { Subject, from } from "rxjs";
import { debounceTime, takeUntil, take } from "rxjs/operators";
import RoomForm from "../../stores/ui/room.form";
import ArduinoStore from "../../stores/domain/arduino.store";
import { Query } from "src/models/query";
import { toStream } from "mobx-utils";
import { CrudState } from "../../stores/domain/crud.store";
import RoomStore from "../../stores/domain/room.store";


export interface RoomInsertProps {
    navigation?: NavigationScreenProp<any, any>;
    arduinoStore?: ArduinoStore;
    roomStore?: RoomStore;
}

@inject((stores: any) => ({
    roomStore: stores.rootStore.roomStore,
    arduinoStore: stores.rootStore.arduinoStore,
}))
@observer
export default class RoomInsertContainer extends React.Component<RoomInsertProps> {
    form: any;
    validate$: Subject<string> = new Subject<string>();
    destroy$: Subject<void> = new Subject<void>();
    query: Query = {};
    constructor(props: RoomInsertProps) {
        super(props);
        this.form = new RoomForm();
        let id = this.props.navigation.getParam("id", null);
        this.props.arduinoStore.getEntitites(this.query, true);
        if(id){
            this.props.roomStore.getEntity(id);
            from(toStream(() => this.props.roomStore.state))
                .pipe(take(1), takeUntil(this.destroy$))
                .subscribe(res => {
                    if (res === CrudState.Done) {
                        let { entity } = this.props.roomStore;
                        if(entity){
                            let model: any = Object.assign({}, entity);
                            this.form.set(model);
                        }                        
                    }
                });
        }
        this.validate$
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe(field => {
                this.form.$(field).validate({showErrors: true})
            })
        
    }
    componentDidMount(): void {
    }

    componentWillUnmount(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    clearValue(field: string): void {
        this.form.$(field).clear();
    }

    sendData(){
        let model = this.form.values();
        model.value = parseInt(model.value, 10);
        this.props.roomStore.createOrUpdate(model, true) 
        from(toStream(() => this.props.roomStore.state))
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(res => {
            if (res === CrudState.Done) {
                this.props.navigation.goBack();
            }
        });
    }

    submit() {
        from(this.form.validate({ showErrors: true}))
            .pipe(take(1))
            .subscribe(({ isValid }) => {
                if (isValid) {
                    this.sendData()
                }
            });
    }

    delete(id: number){
        this.props.roomStore.delete(id, true);
        from(toStream(() => this.props.roomStore.state))
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(res => {
            if (res === CrudState.Done) {
                this.props.navigation.goBack();
            }
        });
    }

    render() {
        let { entities } = this.props.arduinoStore;
        let { entity } = this.props.roomStore;
        entity && entity.id !== 0 && console.log(JSON.stringify(entity));
        return (
            <Container>
                <Content style={{ marginTop: 10 }}>
                    <Form>
                        <View padder>
                            <Item rounded error={Boolean(this.form.$('name').errors() !== null)}>
                                <Input {...this.form.$('name').bind()}
                                    onChangeText={e => {
                                        this.form.$('name').set(e);
                                        //this.validate$.next('name');
                                    }} />
                                {Boolean(this.form.$('name').value )&& <Icon name='close-circle' onPress={() => this.clearValue('name')} />}
                            </Item>
                            {this.form.$('name').error != null && <Text note>{this.form.$('name').error}</Text>}
                        </View>
                        <View padder>
                            <Item rounded error={Boolean(this.form.$('description').errors() !== null)}>
                                <Input {...this.form.$('description').bind()}
                                    onChangeText={e => {
                                        this.form.$('description').set(e);
                                        //this.validate$.next('description');
                                    }} />
                                {Boolean(this.form.$('description').value) && <Icon name='close-circle' onPress={() => this.clearValue('description')} />}
                            </Item>
                            {this.form.$('description').error != null && <Text note>{this.form.$('description').error}</Text>}
                        </View>
                        <View padder>
                            <Item rounded error={this.form.$('fkPortId').errors() !== null}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    headerStyle={{ backgroundColor: "#b95dd3" }}
                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                    headerTitleStyle={{ color: "#fff" }}
                                    selectedValue={this.form.$('fkPortId').value}
                                    onValueChange={e => this.form.$('fkPortId').set(e)}
                                >
                                    <Picker.Item label="Select Port" value={null} />
                                    {entities && entities.map( item => 
                                        <Picker.Item key={item.id} label={item.name.toUpperCase() + " "+ item.value} value={item.id} />
                                    )}
                                </Picker>
                            </Item>
                            {this.form.$('fkPortId').error != null && <Text note>{this.form.$('fkPortId').error}</Text>}
                        </View>
                        
                        <View padder style={{ zIndex: 1, }} >
                            <Button rounded primary
                                style={{ marginTop: 10, justifyContent: 'center', backgroundColor: "green" }}
                                onPress={() => { this.submit() }}>
                                <Text>Save</Text> 
                                {this.props.roomStore.state === CrudState.Submitting && <Spinner style={{marginLeft: 10}} color='white' /> }
                            </Button>
                        </View>

                        <View padder style={{ zIndex: 1, marginBottom: 80 }} >
                            {entity && entity.id && <Button rounded primary
                                style={{ marginTop: 10, justifyContent: 'center', backgroundColor: "red" }}
                                onPress={() => { this.delete(entity.id) }}>
                                <Text>Delete</Text>
                                {this.props.roomStore.state === CrudState.Deleting && <Spinner style={{marginLeft: 10}} color='white' /> }
                            </Button>}
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
}
