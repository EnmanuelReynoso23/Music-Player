import { Color } from '@nativescript/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    onSeek: (position: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <flexboxLayout style={styles.container}>
            <label style={styles.time}>{formatTime(currentTime)}</label>
            <slider
                value={currentTime}
                minValue={0}
                maxValue={duration}
                onValueChange={(args) => onSeek(args.value)}
                style={styles.slider}
            />
            <label style={styles.time}>{formatTime(duration)}</label>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    slider: {
        flex: 1,
        marginHorizontal: 8,
    },
    time: {
        fontSize: 12,
        color: new Color("#666666"),
    },
});