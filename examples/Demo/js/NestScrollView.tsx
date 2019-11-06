/**
 * test nested scrollview 
 */

import React, { useRef } from 'react';
import { View, ScrollView, FlatList, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import { userInfo } from 'os';

interface Props {
    children: JSX.Element;
}

export default function NestScrollView(props: Props) {
    const innerScrollRef = useRef(null);
    const scrollTop = useRef(0);
    function onTouchEnd() {
        console.log('====== nestscrollview onTouchEnd');
    }
    function onScrollEndDrag() {
        console.log('====== nestscrollview onScrollEndDrag');
    }
    function onOuterScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        console.log('====== nestscrollview outer scroll y=' + event.nativeEvent.contentOffset.y + ' contentSize=' + event.nativeEvent.contentSize.height);
    }
    function onInnerScroll() {
        console.log('====== nestscrollview  inner scroll');
    }
    function checkInnerScroll() {
        if (innerScrollRef.current) {

        }
    }

    return (
        <ScrollView
            scrollEnabled={true}
            onScroll={onOuterScroll}
            onTouchEnd={onTouchEnd}
            onScrollEndDrag={onScrollEndDrag}
            style={{flex: 1}}
            contentContainerStyle={{flex: 1}}
        >
            {
                React.cloneElement(props.children, {
                    scrollEnabled: false,
                    ref: innerScrollRef,
                    onScroll: onInnerScroll,
                    listKey: 'inner',
                })
            }
        </ScrollView>
    );
}