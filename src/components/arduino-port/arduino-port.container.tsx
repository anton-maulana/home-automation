import { observer } from "mobx-react";
import { Container, Fab, Icon, View } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
// import assets from "../../assets/assets";
// import styles from "../menu/menu.styles";
import ArduinoPortListComponent from "./arduino-port-list.component";


export interface ArduinoPortProps {
    navigation?: NavigationScreenProp<any, any>,
}

@observer
export default class ArduinoPortContainer extends React.Component<ArduinoPortProps> {

    constructor(props: Readonly<ArduinoPortProps>){
        super(props);
    }
    componentDidMount(): void {
    }

    componentWillUnmount(): void {
        
    }

    render() {
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <ArduinoPortListComponent />

                    <Fab

                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{backgroundColor: '#2e7d32'}}
                        position="bottomRight"
                        onPress={() => { this.props.navigation.navigate("ArduinoPortInsert") }}>
                            <Icon name="add-circle" type="MaterialIcons" />

                    </Fab>

                </View>
            </Container>
        );
    }
}
