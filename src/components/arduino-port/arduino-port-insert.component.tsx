import { inject, observer } from "mobx-react";
import { toStream } from 'mobx-utils';
import { Button, Container, Content, Form, Icon, Input, Item, Picker, Text, View } from "native-base";
import React from "react";
import { from, Subject } from "rxjs";
import { debounceTime, take, takeUntil } from "rxjs/operators";
import ArduinoStore from "../../stores/domain/arduino.store";
import { CrudState } from "../../stores/domain/crud.store";
import ArduinoPortForm from "../../stores/ui/arduino-port.form";

export interface ArduinoPortInsertProps {
    navigation?: any
    arduinoStore?: ArduinoStore;
}
@inject((stores: any) => ({
    arduinoStore: stores.rootStore.arduinoStore,
}))
@observer
export default class ArduinoPortInsertContainer extends React.Component<ArduinoPortInsertProps> {
    form: any;
    validate$: Subject<string> = new Subject<string>();
    destroy$: Subject<void> = new Subject<void>();

    constructor(props: Readonly<ArduinoPortInsertProps>) {
        super(props);
        this.form = new ArduinoPortForm();
        let id = this.props.navigation.getParam("id", null);
        if(id){
            this.props.arduinoStore.getEntity(id);
            from(toStream(() => this.props.arduinoStore.state))
                .pipe(take(1), takeUntil(this.destroy$))
                .subscribe(res => {
                    if (res === CrudState.Done) {
                        let { entity } = this.props.arduinoStore;
                        if(entity){
                            let model: any = Object.assign({}, entity);
                            model.value = model.value.toString();
                            this.form.set(model);
                        }
                        
                    }
                });
        }
        this.validate$
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe(field => {
                this.form.$(field).validate({ showErrors: true })
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
        this.props.arduinoStore.createOrUpdate(model, true) 
        from(toStream(() => this.props.arduinoStore.state))
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
        this.props.arduinoStore.delete(id, true) 
        from(toStream(() => this.props.arduinoStore.state))
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(res => {
            if (res === CrudState.Done) {
                this.props.navigation.goBack();
            }
        });
    }

    render() {
        let { entity } = this.props.arduinoStore;
        return (
            <Container>
                <Content style={{ marginTop: 10 }}>
                    <Form>
                        <View padder>
                            <Item rounded error={this.form.$('description').errors() !== null}>
                                <Input {...this.form.$('description').bind()}
                                    onChangeText={e => {
                                        this.form.$('description').set(e);
                                        //this.validate$.next('description');
                                    }}
                                    autoFocus={true}
                                    returnKeyType={"next"} />
                                {Boolean(this.form.$('description').value) && <Icon name='close-circle' onPress={() => this.clearValue('description')} />}
                            </Item>
                            {this.form.$('description').error != null && <Text note>{this.form.$('description').error}</Text>}
                        </View>
                        <View padder>
                            <Item rounded error={this.form.$('name').errors() !== null}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    headerStyle={{ backgroundColor: "#b95dd3" }}
                                    headerBackButtonTextStyle={{ color: "#fff" }}
                                    headerTitleStyle={{ color: "#fff" }}
                                    selectedValue={this.form.$('name').value}
                                    onValueChange={e => this.form.$('name').set(e)}
                                >
                                    <Picker.Item label="Select Port" value={null} />
                                    <Picker.Item label="Port A" value="port-a" />
                                    <Picker.Item label="Port B" value="port-b" />
                                    <Picker.Item label="Port C" value="port-c" />
                                    <Picker.Item label="Port D" value="port-d" />
                                </Picker>
                            </Item>
                            {this.form.$('name').error != null && <Text note>{this.form.$('name').error}</Text>}
                        </View>

                        <View padder>
                            <Item rounded error={this.form.$('value').errors() !== null}>
                                <Input {...this.form.$('value').bind()}
                                    type="number"
                                    keyboardType="numeric"
                                    onChangeText={e => {
                                        this.form.$('value').set(e);
                                        //this.validate$.next('value')
                                    }} />
                                {Boolean(this.form.$('value').value) && <Icon name='close-circle' onPress={() => this.clearValue('value')} />}
                            </Item>
                            {this.form.$('value').error != null && <Text note>{this.form.$('value').error}</Text>}
                        </View>

                        <View padder style={{ zIndex: 1, }} >
                            <Button rounded primary
                                style={{ marginTop: 10, justifyContent: 'center', backgroundColor: "green" }}
                                onPress={() => { this.submit() }}>
                                <Text>Save</Text>
                                {/* {this.props.verificationReportStore.state === VerificationReportStoreState.Reporting
                                    ? <Spinner color='white' />
                                    : <Text>Save</Text>} */}
                            </Button>
                        </View>

                        <View padder style={{ zIndex: 1, marginBottom: 80 }} >
                            {entity && entity.id && <Button rounded primary
                                style={{ marginTop: 10, justifyContent: 'center', backgroundColor: "red" }}
                                onPress={() => { this.delete(entity.id) }}>
                                <Text>Delete</Text>
                                {/* {this.props.verificationReportStore.state === VerificationReportStoreState.Reporting
                                    ? <Spinner color='white' />
                                    : <Text>Save</Text>} */}
                            </Button>}
                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
}
