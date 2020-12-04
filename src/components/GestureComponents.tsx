// @ts-nocheck
import React from 'react';
import ReactNative, {
  ScrollViewProps,
  SwitchProps,
  TextInputProps,
  DrawerLayoutAndroidProps,
  FlatListProps,
  FlatList,
} from 'react-native';

import createNativeWrapper from '../handlers/createNativeWrapper';

import { NativeViewGestureHandlerProperties } from '../handlers/NativeViewGestureHandler';

const MEMOIZED = new WeakMap();

function memoizeWrap<T>(
  Component: React.ComponentType<T>,
  config?: NativeViewGestureHandlerProperties
) {
  if (Component == null) {
    return null;
  }
  let memoized = MEMOIZED.get(Component);
  if (!memoized) {
    memoized = createNativeWrapper(Component, config);
    MEMOIZED.set(Component, memoized);
  }
  return memoized;
}

type ScrollViewType = React.Component<
  NativeViewGestureHandlerProperties & ScrollViewProps
>;
type SwitchType = React.Component<
  NativeViewGestureHandlerProperties & SwitchProps
>;
type TextInputType = React.Component<
  NativeViewGestureHandlerProperties & TextInputProps
>;
type DrawerLayoutAndroidType = React.Component<
  NativeViewGestureHandlerProperties & DrawerLayoutAndroidProps
>;
type FlatListType<ItemT> = React.Component<
  NativeViewGestureHandlerProperties & FlatListProps<ItemT>
>;

// eslint-disable-next-line import/no-commonjs
module.exports = {
  /* RN's components */
  get ScrollView(): ScrollViewType {
    return memoizeWrap(ReactNative.ScrollView, {
      disallowInterruption: true,
      shouldCancelWhenOutside: false,
    });
  },
  get Switch(): SwitchType {
    return memoizeWrap(ReactNative.Switch, {
      shouldCancelWhenOutside: false,
      shouldActivateOnStart: true,
      disallowInterruption: true,
    });
  },
  get TextInput(): TextInputType {
    return memoizeWrap(ReactNative.TextInput);
  },
  get DrawerLayoutAndroid(): DrawerLayoutAndroidType {
    const DrawerLayoutAndroid = memoizeWrap<DrawerLayoutAndroidProps>(
      ReactNative.DrawerLayoutAndroid,
      {
        disallowInterruption: true,
      }
    );
    DrawerLayoutAndroid.positions = (ReactNative.DrawerLayoutAndroid as typeof ReactNative.DrawerLayoutAndroid).positions;
    return DrawerLayoutAndroid;
  },

  // TODO: get this type somehow
  get FlatList<ItemT>(): FlatListType<ItemT> {
    let memoized = MEMOIZED.get(ReactNative.FlatList);
    if (!memoized) {
      const ScrollView = this.ScrollView;
      memoized = React.forwardRef<FlatList, FlatListProps<ItemT>>(
        (props, ref) => (
          <ReactNative.FlatList
            ref={ref}
            {...props}
            renderScrollComponent={scrollProps => (
              <ScrollView {...scrollProps} />
            )}
          />
        )
      );
      MEMOIZED.set(ReactNative.FlatList, memoized);
    }
    return memoized;
  },
};
