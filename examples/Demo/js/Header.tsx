/**
 * custom header component for pull to refresh
 */

import * as React from 'react';
import {
    Text,
    View,
    ScrollView,
    FlatList,
    Animated,
    PanResponder,
    ViewStyle,
    TextStyle,
    Alert,
} from 'react-native';

import PullToRefresh, { PullToRefreshHeaderProps } from '../../../src/PullToRefresh';

const { Component } = React;

const headerStyle = {
    con: {
        height: 100,
        justifyContent: 'center',
        backgroundColor: 'yellow',
    } as ViewStyle,
    title: {
        fontSize: 22,
    } as TextStyle,
};

interface ClassHeaderState {
    pullDistance: number;
    percent: number;
}

export default class Header extends Component<PullToRefreshHeaderProps, ClassHeaderState> {
    constructor(props: PullToRefreshHeaderProps) {
        super(props);
        this.state = {
            pullDistance: props.pullDistance,
            percent: props.percent,
        };
    }

    setProgress({ pullDistance, percent }: { pullDistance: number; percent: number}) {
        this.setState({
            pullDistance,
            percent,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<PullToRefreshHeaderProps>) {
        this.setState({
            pullDistance: nextProps.pullDistance,
            percent: nextProps.percent,
        });
    }

    render() {
        const { percentAnimatedValue, percent, refreshing } = this.props;
        const { percent: statePercent, pullDistance } = this.state;
        // console.log('header props 2222 ', statePercent, percent, refreshing); 
        let text = 'pull to refresh ';
        if (statePercent >= 1) {
            if (refreshing) {
                text = 'refreshing...';
            } else {
                text = 'release to refresh  ';
            }
        }
        text += pullDistance.toFixed(2);
        return (
            <Animated.View style={[headerStyle.con, { opacity: percentAnimatedValue }]}>
                <Text style={headerStyle.title}>{text}</Text>
            </Animated.View>
        );
    }
}