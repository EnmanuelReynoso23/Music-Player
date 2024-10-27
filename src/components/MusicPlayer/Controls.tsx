import { Color } from '@nativescript/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface ControlsProps {
    isPlaying: boolean;
    isShuffle: boolean;
    repeatMode: 'none' | 'one' | 'all';
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onShuffle: () => void;
    onRepeat: () => void;
    onVolumeChange: (value: number) => void;
    onMute: () => void;
    onPlaybackRateChange: (rate: number) => void;
}

export function Controls({
    isPlaying,
    isShuffle,
    repeatMode,
    volume,
    isMuted,
    playbackRate,
    onPlayPause,
    onNext,
    onPrevious,
    onShuffle,
    onRepeat,
    onVolumeChange,
    onMute,
    onPlaybackRateChange
}: ControlsProps) {
    return (
        <flexboxLayout style={styles.container}>
            <flexboxLayout style={styles.row}>
                <button 
                    className={`p-2 rounded-full ${isShuffle ? 'bg-purple-500' : 'bg-gray-300'}`}
                    onTap={onShuffle}
                >
                    🎲
                </button>
                <button 
                    className="p-2 rounded-full bg-blue-500"
                    onTap={onPrevious}
                >
                    ⏮️
                </button>
                <button 
                    className={`p-3 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-green-500'}`}
                    onTap={onPlayPause}
                >
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button 
                    className="p-2 rounded-full bg-blue-500"
                    onTap={onNext}
                >
                    ⏭️
                </button>
                <button 
                    className={`p-2 rounded-full ${repeatMode !== 'none' ? 'bg-purple-500' : 'bg-gray-300'}`}
                    onTap={onRepeat}
                >
                    {repeatMode === 'one' ? '🔂' : '🔁'}
                </button>
            </flexboxLayout>

            <flexboxLayout style={styles.row}>
                <button 
                    className="p-2"
                    onTap={onMute}
                >
                    {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                </button>
                <slider
                    value={isMuted ? 0 : volume * 100}
                    minValue={0}
                    maxValue={100}
                    onValueChange={(args) => onVolumeChange(args.value / 100)}
                    style={styles.slider}
                />
            </flexboxLayout>

            <flexboxLayout style={styles.row}>
                <label>Speed: </label>
                <button 
                    className="p-1 mx-1 bg-gray-200 rounded"
                    onTap={() => onPlaybackRateChange(0.5)}
                >
                    0.5x
                </button>
                <button 
                    className="p-1 mx-1 bg-gray-200 rounded"
                    onTap={() => onPlaybackRateChange(1.0)}
                >
                    1x
                </button>
                <button 
                    className="p-1 mx-1 bg-gray-200 rounded"
                    onTap={() => onPlaybackRateChange(1.5)}
                >
                    1.5x
                </button>
                <button 
                    className="p-1 mx-1 bg-gray-200 rounded"
                    onTap={() => onPlaybackRateChange(2.0)}
                >
                    2x
                </button>
            </flexboxLayout>
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        backgroundColor: new Color("#f0f0f0"),
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
    },
    slider: {
        flex: 1,
        marginHorizontal: 8,
    },
});