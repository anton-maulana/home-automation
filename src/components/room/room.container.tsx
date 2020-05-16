import { observer } from "mobx-react";
import { Container, Fab, Icon, View } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import RoomListComponent from "./room-list.component";


export interface RoomProps {
    navigation?: NavigationScreenProp<any, any>,
}

@observer
export default class RoomContainer extends React.Component<RoomProps> {

    componentDidMount(): void {
    }

    render() {
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <RoomListComponent />

                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{backgroundColor: '#2e7d32'}}
                        position="bottomRight"
                        onPress={() => { this.props.navigation.navigate("RoomInsert") }}>
                            <Icon name="add-circle" type="MaterialIcons" />

                    </Fab>

                </View>
                {/* <Content style={{marginTop: 10}}>
                    
                    <RoomListComponent />
                </Content> */}
            </Container>
        );
    }
}
