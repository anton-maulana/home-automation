import { observer } from "mobx-react";
import { Body, Button, Container, Content, Header, Icon, Text } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";


export interface SideBarProps {
    navigation?: NavigationScreenProp<any, any>,
}


@observer
export default class SideBarComponent extends React.Component<SideBarProps> {

    componentDidMount(): void {
    }

    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: "green" }} androidStatusBarColor="green">
                    <Body>
                        <Text style={{ color: "white" }}>MENU</Text>
                    </Body>
                </Header>
                <Content style={{marginTop: 10}}>
                    <Button iconRight transparent onPress={() => this.props.navigation.navigate("Room")}>
                        <Text>Rooms</Text>
                        <Icon name='room' type="MaterialIcons" />
                    </Button>
                    <Button iconRight transparent onPress={() => this.props.navigation.navigate("ArduinoPort")}>
                        <Text>Arduino Config</Text>
                        <Icon name='cog' />
                    </Button>
                </Content>
            </Container>
        );
    }
}
