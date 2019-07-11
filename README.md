# react-native-pull-to-refresh-custom
 Custom pull to refresh Header supporting for React Native ScrollView/FlatList

Online Expo demo here: [https://snack.expo.io/@sophister/custom-pull-to-refresh-header](https://snack.expo.io/@sophister/custom-pull-to-refresh-header)

**WARN: use at your own risk!**

## Usage

`PullToRefresh` component can ONLY accept a **single** child, which must be one of `ScrollView`, `FlatList`. (I've only tested it with these two components. Theoretically, it *should* work with other **Scrollable** components such as `SectionList`).

```typescript
//Props interface for PullToRefresh
interface PullToRefreshProps {
    // container's style. You should give it a `backgroundColor`, without it,
    // the PanResponder will be terminated on iOS, according to my test
    style: ViewStyle;
    // your custom Header component, it **MUST** implement a 
    HeaderComponent: ComponentType<PullToRefreshHeaderProps & RefAttributes<any>>;
    // Header component's height
    headerHeight: number;
    // pulling height to trigger `onRefresh` callback, default to `headerHeight`
    refreshTriggerHeight?: number;
    // container's sticky top position when `refreshing` is true, default to `headerHeight`
    refreshingHoldHeight?: number;
    // is refreshing
    refreshing: boolean;
    // parent's callback if user's pull distance trigger a refreshing
    onRefresh: () => void;
    // child component
    children: JSX.Element;
    // when the inner scrollable's contentOffset.y <= topPullThreshold,
    // pulling down will trigger container's translate
    topPullThreshold: number;
}

// Header component's Props interface
interface PullToRefreshHeaderProps {
    // current pull distance of container component
    pullDistance: number;
    // current pull ratio range of [0, 1]
    percentAnimatedValue: Animated.AnimatedDivision;
    // current pull ratio, range of [0, 1]
    percent: number;
    // is currently refreshing
    refreshing: boolean;
}
```

```typescript
class Header extends Component {
    // Header component **MUST** expose a `setProgress` method,
    // which is called when user is pulling container down
    // pullDistance is user's pull distance
    // percent is current pull ratio range of [0, 1]
    setProgress({ pullDistance, percent }: { pullDistance: number; percent: number}) {
        this.setState({
            pullDistance,
            percent,
        });
    }
}

<PullToRefresh
    HeaderComponent={Header}
    headerHeight={100}
    refreshTriggerHeight={180}
    refreshingHoldHeight={140}
    refreshing={this.state.refreshing}
    onRefresh={this.onRefresh}
    style={{ flex: 1, backgroundColor: 'red' }}
>
    <FlatList
        style={{ flex: 1 }}
        scrollEventThrottle={20}
        {...otherProps}
    />
</PullToRefresh>
```

### Header component WARNING

Your custom `Header` component, **MUST** have a method called `setProgress`!

Your custom `Header` component, **MUST** have a method called `setProgress`!

Your custom `Header` component, **MUST** have a method called `setProgress`!

**But why?**

I've tried to pass the `pullDistance` and `percent` to header component through the traditional `React`'s props flow. To do so, I've to keep `pullDistance` on `PullToRefresh`'s `state`, and call `setState()` every time when user is pulling down the container. But it results in a janky animation. So, I decide to pass `pullDistance` to the header component through a method call. 

## PullToRefresh style WARNING

When I test `PullToRefresh` component on **iOS**, the container's pan responder will be terminated after it is granted, if I don't give it a `backgroundColor`. So, `PullToRefresh` will have a `white` background color default. 