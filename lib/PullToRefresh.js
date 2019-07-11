/**
 * Container for ScrollView/FlatList, providing custom pull-to-refresh Header support
 */
import React, { Component } from 'react';
import { View, Animated, PanResponder, } from 'react-native';
const styles = {
    con: {
        flex: 1,
        // Android上，不设置这个背景色，貌似会触发  onPanResponderTerminate ！！！
        backgroundColor: '#fff',
    },
};
export default class PullToRefresh extends Component {
    constructor(props) {
        super(props);
        // 当前容器移动的距离
        this.containerTranslateY = 0;
        // 内部scroll容器顶部滚动的距离
        this.innerScrollTop = 0;
        // header 组件的引用
        this.headerRef = null;
        // 下拉容器的过程中，动态传递下拉的距离给 header 组件，直接调用方法，不走本组件的 setState，避免卡顿
        this.containerTopChange = ({ value }) => {
            this.containerTranslateY = value;
            if (this.headerRef) {
                this.headerRef.setProgress({
                    pullDistance: value,
                    percent: value / (this.props.refreshTriggerHeight || this.props.headerHeight),
                });
            }
        };
        this.innerScrollCallback = (event) => {
            this.innerScrollTop = event.nativeEvent.contentOffset.y;
        };
        this.state = {
            // 容器偏离顶部的距离
            containerTop: new Animated.Value(0),
        };
        this.state.containerTop.addListener(this.containerTopChange);
        // this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
        this.onMoveShouldSetResponder = this.onMoveShouldSetResponder.bind(this);
        this.onResponderGrant = this.onResponderGrant.bind(this);
        this.onResponderReject = this.onResponderReject.bind(this);
        this.onPanResponderMove = this.onPanResponderMove.bind(this);
        this.onPanResponderRelease = this.onPanResponderRelease.bind(this);
        this.onPanResponderTerminate = this.onPanResponderTerminate.bind(this);
        this._panResponder = PanResponder.create({
            // onStartShouldSetPanResponder: this.onStartShouldSetResponder,
            onMoveShouldSetPanResponder: this.onMoveShouldSetResponder,
            onPanResponderGrant: this.onResponderGrant,
            onPanResponderReject: this.onResponderReject,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminationRequest: (evt, gestureState) => { console.log('onPanResponderTerminationRequest'); return true; },
            onPanResponderTerminate: this.onPanResponderTerminate,
        });
    }
    // onStartShouldSetResponder(event, gestureState) {
    //     console.log('onStartShouldSetResponder', gestureState);
    //     return false;
    // }
    onMoveShouldSetResponder(event, gestureState) {
        if (this.props.refreshing) {
            // 正在刷新中，不接受再次下拉
            return false;
        }
        if (this.innerScrollTop <= this.props.topPullThreshold && gestureState.dy > 0) {
            return true;
        }
        return false;
    }
    onResponderGrant(event, gestureState) {
    }
    onResponderReject(event, gestureState) {
    }
    onPanResponderMove(event, gestureState) {
        const dy = Math.max(0, gestureState.dy);
        this.state.containerTop.setValue(dy);
    }
    onPanResponderRelease(event, gestureState) {
        // 判断是否达到了触发刷新的条件
        const threshold = this.props.refreshTriggerHeight || this.props.headerHeight;
        if (this.containerTranslateY >= threshold) {
            // 触发刷新
            this.props.onRefresh();
        }
        else {
            // 没到刷新的位置，回退到顶部
            this._resetContainerPosition();
        }
    }
    onPanResponderTerminate(event, gestureState) {
        this._resetContainerPosition();
    }
    _resetContainerPosition() {
        Animated.timing(this.state.containerTop, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.refreshing && this.props.refreshing) {
            // 从 未加载 变化到 加载中
            const holdHeight = this.props.refreshingHoldHeight || this.props.headerHeight;
            Animated.timing(this.state.containerTop, {
                toValue: holdHeight,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
        else if (prevProps.refreshing && !this.props.refreshing) {
            // 从 加载中 变化到 未加载
            Animated.timing(this.state.containerTop, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }
    componentWillUnmount() {
        this.state.containerTop.removeAllListeners();
    }
    renderHeader() {
        const style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            top: -this.props.headerHeight,
            transform: [{ translateY: this.state.containerTop }],
        };
        const percent = Animated.divide(this.state.containerTop, this.props.refreshTriggerHeight || this.props.headerHeight);
        const Header = this.props.HeaderComponent;
        return (<Animated.View style={style}>
                <Header ref={(c) => { this.headerRef = c; }} percentAnimatedValue={percent} pullDistance={this.containerTranslateY} percent={this.containerTranslateY / this.props.headerHeight} refreshing={this.props.refreshing}/>
            </Animated.View>);
    }
    render() {
        const child = React.cloneElement(this.props.children, {
            onScroll: this.innerScrollCallback,
            bounces: false,
            alwaysBounceVertical: false,
        });
        return (<View style={this.props.style} {...this._panResponder.panHandlers}>
                <Animated.View style={[{ flex: 1, transform: [{ translateY: this.state.containerTop }] }]}>
                    {child}
                </Animated.View>
                {this.renderHeader()}
            </View>);
    }
}
PullToRefresh.defaultProps = {
    style: styles.con,
    refreshing: false,
    topPullThreshold: 2,
};
