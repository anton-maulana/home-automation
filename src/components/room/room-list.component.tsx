import { inject, observer } from "mobx-react";
import { Body, ListItem, Text } from "native-base";
import React from "react";
import { FlatList } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Room } from "../../models/room";
import { Query } from "../../models/query";
import { CrudState } from "../../stores/domain/crud.store";
import RoomStore from "../../stores/domain/room.store";


export interface RoomListProps {
    navigation?: NavigationScreenProp<any, any>;
    roomStore?: RoomStore;
}

@inject((stores: any) => ({
    roomStore: stores.rootStore.roomStore,
    navigation: stores.rootStore.navigationStore,
}))
@observer
export default class RoomListComponent extends React.Component<RoomListProps> {
    destroy$: Subject<void> = new Subject<void>();
    fetch$: Subject<Query> = new Subject<Query>();
    query: Query = {};

    constructor(props: Readonly<RoomListProps>){
        super(props);
        this.props.roomStore.getEntitites(this.query);
        this.fetch$.pipe(takeUntil(this.destroy$))
            .subscribe(query =>{
                this.props.roomStore.getEntitites(query);
            })
    }

    componentDidMount() {
        this.props.roomStore.refresh$
            .pipe(takeUntil(this.destroy$))
            .subscribe(e => {
                this.fetch$.next(this.query);
            })
    }

    componentWillUnmount(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.props.roomStore.setNullEntities();
    }

    renderEmptyList = () => {
        return (
            <Text>No Data Available</Text>
        )
    }

    navigate(item: Room){
        this.props.navigation.navigate("RoomInsert", {id: item.id});
    }

    render() {
        let { entities, state } = this.props.roomStore;
        return (
            <FlatList
                data={entities}
                refreshing={state === CrudState.Refreshing}
                onRefresh={() => {
                    this.query.page = 1;
                    this.props.roomStore.getEntitites(this.query, true);
                }}
                onEndReachedThreshold={0.05}
                onEndReached={({ distanceFromEnd }) => {
                    if (state === CrudState.Fetching || distanceFromEnd < -10)
                        return;
                    this.query.page += 1;
                    this.props.roomStore.getEntitites(this.query);
                }}
                ListEmptyComponent={this.renderEmptyList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <ListItem key={item.toString()} onPress={() => this.navigate(item)}>
                        <Body>
                            <Text>{item.name}</Text>
                        </Body>
                    </ListItem>
                }
            />
        );
    }
}
