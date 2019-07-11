/**
 * Container for ScrollView/FlatList, providing custom pull-to-refresh Header support
 */
import { Component, ComponentType, RefAttributes } from 'react';
import { ViewStyle, Animated, PanResponderInstance, GestureResponderEvent, PanResponderGestureState, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
export interface PullToRefreshHeaderProps {
    pullDistance: number;
    percentAnimatedValue: Animated.AnimatedDivision;
    percent: number;
    refreshing: boolean;
}
export interface Props {
    style: ViewStyle;
    HeaderComponent: ComponentType<PullToRefreshHeaderProps & RefAttributes<any>>;
    headerHeight: number;
    refreshTriggerHeight?: number;
    refreshingHoldHeight?: number;
    refreshing: boolean;
    onRefresh: () => void;
    children: JSX.Element;
    topPullThreshold: number;
}
interface State {
    containerTop: Animated.Value;
}
export default class PullToRefresh extends Component<Props, State> {
    static defaultProps: {
        style: ViewStyle;
        refreshing: boolean;
        topPullThreshold: number;
    };
    containerTranslateY: number;
    innerScrollTop: number;
    _panResponder: PanResponderInstance;
    headerRef: any;
    constructor(props: Props);
    onMoveShouldSetResponder(event: GestureResponderEvent, gestureState: PanResponderGestureState): boolean;
    onResponderGrant(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
    onResponderReject(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
    onPanResponderMove(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
    onPanResponderRelease(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
    onPanResponderTerminate(event: GestureResponderEvent, gestureState: PanResponderGestureState): void;
    _resetContainerPosition(): void;
    containerTopChange: ({ value }: {
        value: number;
    }) => void;
    innerScrollCallback: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void;
    componentWillUnmount(): void;
    renderHeader(): JSX.Element;
    render(): JSX.Element;
}
export {};
