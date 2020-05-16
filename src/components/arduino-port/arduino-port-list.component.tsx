import { inject, observer } from "mobx-react";
import { Body, ListItem, Right, Text } from "native-base";
import React from "react";
import { FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Port } from "../../models/port";
import { Query } from "../../models/query";
import ArduinoStore from "../../stores/domain/arduino.store";
import { CrudState } from "../../stores/domain/crud.store";


export interface ArduinoPortListProps {
    navigation?: NavigationScreenProp<any, any>;
    arduinoStore?: ArduinoStore
}

@inject((stores: any) => ({
    arduinoStore: stores.rootStore.arduinoStore,
    navigation: stores.rootStore.navigationStore,
}))
@observer
export default class ArduinoPortListComponent extends React.Component<ArduinoPortListProps> {
    fetch$: Subject<Query> = new Subject<Query>();
    destroy$: Subject<void> = new Subject<void>();
    query: Query = {
        sort: '-dateCreated',
        page: 1,
        perPage: 15,
        data: {}        
    }

    constructor(props: Readonly<ArduinoPortListProps>){
        super(props);
        this.props.arduinoStore.getEntitites(this.query, true);
        this.fetch$.pipe(takeUntil(this.destroy$))
            .subscribe((query: Query) =>{
                this.props.arduinoStore.getEntitites(query, true);
            })
    }

    componentDidMount(): void {
        this.props.arduinoStore.refresh$
            .pipe(takeUntil(this.destroy$))
            .subscribe(e => {
                this.fetch$.next(this.query);
            })

    }
    componentWillUnmount(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    renderEmptyList(){
        return (
            <Text> Not Data Available </Text>
        )
    }

    navigate(item: Port){
        this.props.navigation.navigate("ArduinoPortInsert", {id: item.id})
    }

    render() {
        let { entities, state } = this.props.arduinoStore;
        return (
            <FlatList
                data={entities}
                refreshing={state === CrudState.Refreshing}
                onRefresh={() => {
                    this.query.page = 1;
                    this.props.arduinoStore.getEntitites(this.query, true);
                }}
                onEndReachedThreshold={0.05}
                onEndReached={({ distanceFromEnd }) => {
                    if (state === CrudState.Fetching || distanceFromEnd < -10)
                        return;
                    this.query.page += 1;
                    this.props.arduinoStore.getEntitites(this.query);
                }}
                ListEmptyComponent={this.renderEmptyList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <ListItem key={item.toString()} onPress={() =>this.navigate(item)}>
                        <Body>
                            <Text >{item.description}</Text>
                        </Body>
                        <Right style={{display: "flex" }}>
                            <Text style={{display: "flex", fontSize: 12}}>{`${(item.name).toUpperCase()} ${item.value}`}</Text>
                        </Right>
                    </ListItem>
                }
            />
        );
    }
}
