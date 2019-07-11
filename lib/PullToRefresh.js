"use strict";
/**
 * Container for ScrollView/FlatList, providing custom pull-to-refresh Header support
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var styles = {
    con: {
        flex: 1,
        // Android上，不设置这个背景色，貌似会触发  onPanResponderTerminate ！！！
        backgroundColor: '#fff',
    },
};
var PullToRefresh = /** @class */ (function (_super) {
    __extends(PullToRefresh, _super);
    function PullToRefresh(props) {
        var _this = _super.call(this, props) || this;
        // 当前容器移动的距离
        _this.containerTranslateY = 0;
        // 内部scroll容器顶部滚动的距离
        _this.innerScrollTop = 0;
        // header 组件的引用
        _this.headerRef = null;
        // 下拉容器的过程中，动态传递下拉的距离给 header 组件，直接调用方法，不走本组件的 setState，避免卡顿
        _this.containerTopChange = function (_a) {
            var value = _a.value;
            _this.containerTranslateY = value;
            if (_this.headerRef) {
                _this.headerRef.setProgress({
                    pullDistance: value,
                    percent: value / (_this.props.refreshTriggerHeight || _this.props.headerHeight),
                });
            }
        };
        _this.innerScrollCallback = function (event) {
            _this.innerScrollTop = event.nativeEvent.contentOffset.y;
        };
        _this.state = {
            // 容器偏离顶部的距离
            containerTop: new react_native_1.Animated.Value(0),
        };
        _this.state.containerTop.addListener(_this.containerTopChange);
        // this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
        _this.onMoveShouldSetResponder = _this.onMoveShouldSetResponder.bind(_this);
        _this.onResponderGrant = _this.onResponderGrant.bind(_this);
        _this.onResponderReject = _this.onResponderReject.bind(_this);
        _this.onPanResponderMove = _this.onPanResponderMove.bind(_this);
        _this.onPanResponderRelease = _this.onPanResponderRelease.bind(_this);
        _this.onPanResponderTerminate = _this.onPanResponderTerminate.bind(_this);
        _this._panResponder = react_native_1.PanResponder.create({
            // onStartShouldSetPanResponder: this.onStartShouldSetResponder,
            onMoveShouldSetPanResponder: _this.onMoveShouldSetResponder,
            onPanResponderGrant: _this.onResponderGrant,
            onPanResponderReject: _this.onResponderReject,
            onPanResponderMove: _this.onPanResponderMove,
            onPanResponderRelease: _this.onPanResponderRelease,
            onPanResponderTerminationRequest: function (evt, gestureState) { console.log('onPanResponderTerminationRequest'); return true; },
            onPanResponderTerminate: _this.onPanResponderTerminate,
        });
        return _this;
    }
    // onStartShouldSetResponder(event, gestureState) {
    //     console.log('onStartShouldSetResponder', gestureState);
    //     return false;
    // }
    PullToRefresh.prototype.onMoveShouldSetResponder = function (event, gestureState) {
        if (this.props.refreshing) {
            // 正在刷新中，不接受再次下拉
            return false;
        }
        if (this.innerScrollTop <= this.props.topPullThreshold && gestureState.dy > 0) {
            return true;
        }
        return false;
    };
    PullToRefresh.prototype.onResponderGrant = function (event, gestureState) {
    };
    PullToRefresh.prototype.onResponderReject = function (event, gestureState) {
    };
    PullToRefresh.prototype.onPanResponderMove = function (event, gestureState) {
        var dy = Math.max(0, gestureState.dy);
        this.state.containerTop.setValue(dy);
    };
    PullToRefresh.prototype.onPanResponderRelease = function (event, gestureState) {
        // 判断是否达到了触发刷新的条件
        var threshold = this.props.refreshTriggerHeight || this.props.headerHeight;
        if (this.containerTranslateY >= threshold) {
            // 触发刷新
            this.props.onRefresh();
        }
        else {
            // 没到刷新的位置，回退到顶部
            this._resetContainerPosition();
        }
    };
    PullToRefresh.prototype.onPanResponderTerminate = function (event, gestureState) {
        this._resetContainerPosition();
    };
    PullToRefresh.prototype._resetContainerPosition = function () {
        react_native_1.Animated.timing(this.state.containerTop, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };
    PullToRefresh.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!prevProps.refreshing && this.props.refreshing) {
            // 从 未加载 变化到 加载中
            var holdHeight = this.props.refreshingHoldHeight || this.props.headerHeight;
            react_native_1.Animated.timing(this.state.containerTop, {
                toValue: holdHeight,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
        else if (prevProps.refreshing && !this.props.refreshing) {
            // 从 加载中 变化到 未加载
            react_native_1.Animated.timing(this.state.containerTop, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    };
    PullToRefresh.prototype.componentWillUnmount = function () {
        this.state.containerTop.removeAllListeners();
    };
    PullToRefresh.prototype.renderHeader = function () {
        var _this = this;
        var style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            top: -this.props.headerHeight,
            transform: [{ translateY: this.state.containerTop }],
        };
        var percent = react_native_1.Animated.divide(this.state.containerTop, this.props.refreshTriggerHeight || this.props.headerHeight);
        var Header = this.props.HeaderComponent;
        return (<react_native_1.Animated.View style={style}>
                <Header ref={function (c) { _this.headerRef = c; }} percentAnimatedValue={percent} pullDistance={this.containerTranslateY} percent={this.containerTranslateY / this.props.headerHeight} refreshing={this.props.refreshing}/>
            </react_native_1.Animated.View>);
    };
    PullToRefresh.prototype.render = function () {
        var child = react_1.default.cloneElement(this.props.children, {
            onScroll: this.innerScrollCallback,
            bounces: false,
            alwaysBounceVertical: false,
        });
        return (<react_native_1.View style={this.props.style} {...this._panResponder.panHandlers}>
                <react_native_1.Animated.View style={[{ flex: 1, transform: [{ translateY: this.state.containerTop }] }]}>
                    {child}
                </react_native_1.Animated.View>
                {this.renderHeader()}
            </react_native_1.View>);
    };
    PullToRefresh.defaultProps = {
        style: styles.con,
        refreshing: false,
        topPullThreshold: 2,
    };
    return PullToRefresh;
}(react_1.Component));
exports.default = PullToRefresh;
