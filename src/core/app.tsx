import { observer, Provider } from "mobx-react";
import { Root, StyleProvider } from "native-base";
import React from "react";
import getTheme from "../theme/components";
import variables from "../theme/variables/platform";
import AppContainer from "./navigation";
import rootStore from "./store";

@observer
export default class App extends React.Component<{}, {}> {    
    render() {
        return (
            <StyleProvider style={getTheme(variables)}>
                <Provider rootStore={rootStore}>
                    <Root>
                        <AppContainer ref={rootStore.navigationStore.createRef} />
                    </Root>
                </Provider>
            </StyleProvider>
        );
    }
}
