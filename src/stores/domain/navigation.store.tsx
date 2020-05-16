import { observable, action } from 'mobx';
import { NavigationScreenProp, NavigationState, NavigationContainerComponent, NavigationAction, NavigationParams } from 'react-navigation';

export default class Navigation {
    @observable.ref navigation: NavigationScreenProp<NavigationState> | undefined;
    @observable isLoading: boolean = true;

    @action.bound createRef(ref: NavigationContainerComponent & { _navigation: NavigationScreenProp<NavigationState> }) {
        if (ref) {
            this.navigation = ref._navigation;
            this.isLoading = false;
        }
    }

    @action.bound dispatch(action: NavigationAction) {
        if (!this.navigation) {
            throw new Error('please create navigation refs first.');
        }
        this.navigation.dispatch(action);
    }

    @action.bound getParam(paramName: string, fallback?: NavigationParams) {
        if (!this.navigation) {
            throw new Error('please create navigation refs first.');
        }
        this.navigation.getParam(paramName, fallback);
    }

    @action.bound setParams(newParams: NavigationParams) {
        if (!this.navigation) {
            throw new Error('please create navigation refs first.');
        }
        this.navigation.setParams(newParams);
    }

    @action.bound navigate(
        routeNameOrOptions: string | {
            routeName: string | {
                routeName: string;
                params?: NavigationParams;
                action?: NavigationAction;
                key?: string;
            };
            params?: NavigationParams;
            action?: NavigationAction;
            key?: string;
        },
        params?: NavigationParams,
        action?: NavigationAction,
    ) {
        if (!this.navigation) {
            throw new Error('please create navigation refs first.');
        }
        this.navigation.navigate(routeNameOrOptions as string, params, action);
    }    

    @action.bound goBack(routeKey?: string | null) {
        if (!this.navigation) {
            throw new Error('please create navigation refs first.');
        }
        this.navigation.goBack(routeKey);
    }    
}