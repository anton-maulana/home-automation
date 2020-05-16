import { observer } from "mobx-react";
import { Button, Footer, FooterTab, Text } from "native-base";
import React from "react";
import { NavigationScreenProp } from "react-navigation";


export interface TabProps {
    navigation?: NavigationScreenProp<any, any>,
}

@observer
export default class TabComponent extends React.Component<TabProps> {

    componentDidMount(): void {
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button style={{backgroundColor: '#2e7d32'}}>
                        <Text>Home</Text>
                    </Button>
                    <Button style={{backgroundColor: '#2e7d32'}}>
                        <Text>Settings</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}
