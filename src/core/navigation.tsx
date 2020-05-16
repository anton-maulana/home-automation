import { Button, Icon } from 'native-base';
import React from 'react';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ArduinoPortInsert from '../components/arduino-port/arduino-port-insert.component';
import ArduinoPortContainer from '../components/arduino-port/arduino-port.container';
import DetailComponent from '../components/home/detail.component';
import HomeContainer from '../components/home/home.container';
import RoomInsertCompoemt from '../components/room/room-insert.component';
import RoomContainer from '../components/room/room.container';
import SideBarComponent from '../components/shared/sidebar.component';
import rootStore from './store';

let MainStackNav = createStackNavigator(
    {
            HomeApp: { screen: HomeContainer, navigationOptions: {
                title: "Home Apps",
                headerLeft: (navigation) => 
                <Button
                    transparent
                    light
                    onPress={() => { if(rootStore && rootStore.navigationStore){
                        rootStore.navigationStore.navigation.dispatch(DrawerActions.openDrawer());
                    }}}>
                    <Icon style={{ color: 'white' }} type='Ionicons' name='menu' />
                </Button>,
                headerStyle: {backgroundColor: "green"},  
            }
        },
        Room: { screen: RoomContainer },
        RoomInsert: { screen: RoomInsertCompoemt},
        ArduinoPort: { screen: ArduinoPortContainer },
        ArduinoPortInsert: { screen: ArduinoPortInsert },
        Detail: { screen: DetailComponent }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#2e7d32',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
        initialRouteName: "HomeApp"
    }
);

let AppTabNavigator = createMaterialTopTabNavigator(
    {
        MainStackNav: MainStackNav,
    },
    {
        lazy: true,
        navigationOptions: { gestureEnabled: false },
        tabBarPosition: 'bottom',
        style: {
            backgroundColor: '#2e7d32'
        },
        initialRouteName: "MainStackNav",
        tabBarComponent: (props) => null //<TabComponent />
    }
);
AppTabNavigator.navigationOptions = { headerShown: false };

let DrawerNavigator = createDrawerNavigator(
    {
        AppTabNav: AppTabNavigator,
    },
    {
        contentComponent: props => <SideBarComponent {...props} />,
        initialRouteName: 'AppTabNav',
        contentOptions: {
            activeTintColor: '#2e7d32',
            itemsContainerStyle: {
                marginVertical: 0,
            },
            iconContainerStyle: {
                opacity: 1
            }
        }
    }
);
DrawerNavigator.navigationOptions = { headerShown: false };
let AppContainer = createAppContainer(DrawerNavigator);

export default AppContainer;