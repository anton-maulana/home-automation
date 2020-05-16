import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import 'mobx-react-lite/batchingForReactNative';
import { Body, Button, Container, Header, Icon, Input, Item, ListItem, Right, Spinner, Switch, Text, View } from 'native-base';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Room } from '../../models/room';
import { Query } from '../../models/query';
import { CrudState } from '../../stores/domain/crud.store';
import RoomStore from '../../stores/domain/room.store';

export interface HomeProps {
    navigation?: NavigationScreenProp<any, any>;
    roomStore: RoomStore;
}

@inject((stores: any) => ({
    roomStore: stores.rootStore.roomStore,
}))
@observer
export default class HomeContainer extends React.Component<HomeProps> {
    query: Query = {
        sort: '-id',
        page: 1,
        perPage: 15,
        data: {
            type: "home"
        }
    }

    fetch$: Subject<Query> = new Subject<Query>();
    destroy$: Subject<void> = new Subject();

    constructor(props: Readonly<HomeProps>) {
        super(props);
        this.fetch$.pipe(takeUntil(this.destroy$))
            .subscribe(query => {
                this.props.roomStore.getEntitites(query, true);
            })
    }

    componentDidMount(): void {
        this.props.roomStore.refresh$
            .pipe(takeUntil(this.destroy$))
            .subscribe(e => {
                this.fetch$.next(this.query);
            })
    }
    
    componentWillUnmount(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @action
    setActiveItem(item: Room, index: number = null) {
        let model = Object.assign({}, item);
        index !== null && (this.props.roomStore.entities[index].active =  !model.active);
        
        model.active = !model.active;
        this.props.roomStore.createOrUpdate(model, true);
    }

    render() {
        let { entities, state, isLoading, onLoading } = this.props.roomStore;
        return (
            <Container>
                <Header searchBar rounded style={{ backgroundColor: '#2e7d32' }} androidStatusBarColor="green" >
                    <Item rounded>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <NavigationEvents onDidFocus={() => this.props.roomStore.getEntitites(this.query, true) } />
                {/* <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position=""
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="share" />
                </Fab> */}
                {entities !== null && entities.length !== 0 ?
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
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                            <ListItem icon key={item.id}>
                                <Body>
                                    <Button hasText transparent onPress={() => this.props.navigation.navigate("Detail")}>
                                        <Text>{item.name}</Text>
                                    </Button>
                                </Body>
                                <Right>
                                    <Spinner size="small" animating={isLoading && onLoading && onLoading[item.id] && state !== CrudState.Done}></Spinner> 
                                    <Switch  value={item.active} onValueChange={status => this.setActiveItem(item, index)} />

                                </Right>
                            </ListItem>
                        }
                    />

                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
                        <Text>No Data Available</Text>
                    </View>
                }

            </Container>
        );
    }
}