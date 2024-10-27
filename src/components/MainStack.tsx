import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { MusicPlayer } from "./MusicPlayer";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Music Player"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#65adf1",
                },
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Music Player"
                component={MusicPlayer}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);