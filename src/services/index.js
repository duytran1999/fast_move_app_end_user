export const onTabPress = (navigation, route) => {
    // if (navigation?.isFocused?.()) {
    //     route?.params?.scrollToTop?.();
    // }

    console.log(navigation)
};

export const scrollToTop = (navigation, ref) => {
    navigation.setParams({
        scrollToTop: () => ref?.current?.scrollToOffset(0, 0, true)
    });
};