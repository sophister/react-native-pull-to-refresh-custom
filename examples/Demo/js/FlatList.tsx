/**
 * demo of using FlatList with custom pull-to-refresh header
 */
import React, { useEffect } from 'react';
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

// import LottieView from 'lottie-react-native';

import PullToRefresh, { PullToRefreshHeaderProps } from '../../../src/PullToRefresh';
import Header from './Header';
import NestScrollView from './NestScrollView';

const { Component } = React;

interface DataItem {
    key: string;
    text: string;
    on: boolean;
}

const data: DataItem[] = [];
for (let i = 0; i < 500; i++) {
    data.push({
        key: `data-${i}`,
        text: `number: ${i}`,
        on: false,
    });
}

const pageStyle = {
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 0,
    } as ViewStyle,
    listCon: {
        flex: 1,
        backgroundColor: 'blue',
    } as ViewStyle,
    item: {
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        paddingLeft: 15,
        backgroundColor: 'pink',
    } as ViewStyle,
    itemOdd: {
        backgroundColor: 'green',
    },
    itemText: {
        color: '#fff',
        textAlign: 'left',
        fontSize: 28,
    } as TextStyle,
};

interface State {
    refreshing: boolean;
    data: DataItem[];
}

function ItemView({children, index}: { children: React.ReactElement, index: number}) {
    useEffect(function(){
        console.log('====== item loaded = ' + index);
    }, []);
    return children;
}

export default class App extends React.Component<{}, State> {
    state = {
        data: data.slice(0, 50),
        refreshing: false,
    };

    _renderItem = (item: DataItem, index: number, prefix = '') => {
        const conStyles = [pageStyle.item];
        if (index % 2 === 1) {
            conStyles.push(pageStyle.itemOdd);
        }
        return (
            <ItemView key={index} index={index}>
                <View style={conStyles}>
                    <Text onPress={() => { Alert.alert('click', item.text); }} style={pageStyle.itemText}>in page {prefix} {item.text}</Text>
                </View>
            </ItemView>
        );
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
        });
        setTimeout(() => {
            this.setState((prevState) => {
                return {
                    refreshing: false,
                    data: prevState.data.concat(data.slice(prevState.data.length, prevState.data.length + 50)),
                };
            });
        }, 3000);
    };

    // 测试 FlatList 嵌套
    flatListTest() {
        return (
            <PullToRefresh
                HeaderComponent={Header}
                headerHeight={100}
                refreshTriggerHeight={140}
                refreshingHoldHeight={140}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                style={{ flex: 1, backgroundColor: 'red' }}
            >
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.data}
                    scrollEventThrottle={20}
                    pinchGestureEnabled={false}
                    renderItem={({ item, index }: { item: DataItem; index: number}) => { return this._renderItem(item, index, 'FlatList'); }}
                />
            </PullToRefresh>
        );
    }

    scrollViewTest() {
        return (
            <PullToRefresh
                HeaderComponent={Header}
                headerHeight={100}
                refreshTriggerHeight={140}
                refreshingHoldHeight={140}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                style={{ flex: 1, backgroundColor: 'red' }}
            >
                <ScrollView>
                    {this.state.data.map((obj, index) =>{
                        return this._renderItem(obj, index, 'scroll3');
                    })}
                </ScrollView>
            </PullToRefresh>
        );
    }

    nestScrollViewTest() {
        return (
            <NestScrollView>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.data}
                    scrollEventThrottle={20}
                    pinchGestureEnabled={false}
                    renderItem={({ item, index }: { item: DataItem; index: number}) => { return this._renderItem(item, index, 'FlatList'); }}
                />
            </NestScrollView>
        );
    }

    nestScrollTest2() {
        return (
            <NestScrollView>
                <ScrollView>
                    {this.state.data.map((obj, index) =>{
                        return this._renderItem(obj, index, 'scroll2');
                    })}
                </ScrollView>
            </NestScrollView>
        );
    }

    snapTest() {
        return (
            <FlatList
                snapToOffsets={[40]}
                style={{ flex: 1 }}
                data={this.state.data}
                scrollEventThrottle={20}
                pinchGestureEnabled={false}
                renderItem={({ item, index }: { item: DataItem; index: number}) => { return this._renderItem(item, index, 'FlatList'); }}
            />
        );
    }

    render() {
        const { state } = this;
        return (
            <View style={pageStyle.container}>
                { this.scrollViewTest() }
            </View>
        );
    }
}


