import { File } from '@nativescript/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";

interface QueueProps {
    songs: File[];
    currentSong: File | null;
    queue: File[];
    onSongSelect: (song: File) => void;
    onAddToQueue: (song: File) => void;
    onRemoveFromQueue: (index: number) => void;
    favorites: Set<string>;
    onToggleFavorite: (song: File) => void;
}

export function Queue({
    songs,
    currentSong,
    queue,
    onSongSelect,
    onAddToQueue,
    onRemoveFromQueue,
    favorites,
    onToggleFavorite,
}: QueueProps) {
    return (
        <scrollView style={styles.container}>
            <label className="text-xl font-bold mb-2">Queue</label>
            {queue.map((song, index) => (
                <gridLayout key={index} columns="*, auto, auto" className="mb-2 p-2 bg-gray-100 rounded">
                    <label col="0" className={`${currentSong === song ? 'text-blue-500 font-bold' : ''}`}>
                        {song.name}
                    </label>
                    <button 
                        col="1" 
                        className="mx-2"
                        onTap={() => onToggleFavorite(song)}
                    >
                        {favorites.has(song.path) ? '❤️' : '🤍'}
                    </button>
                    <button 
                        col="2"
                        className="text-red-500"
                        onTap={() => onRemoveFromQueue(index)}
                    >
                        ❌
                    </button>
                </gridLayout>
            ))}

            <label className="text-xl font-bold mt-4 mb-2">Library</label>
            {songs.map((song, index) => (
                <gridLayout key={index} columns="*, auto, auto" className="mb-2 p-2 bg-gray-100 rounded">
                    <label col="0" className={`${currentSong === song ? 'text-blue-500 font-bold' : ''}`}>
                        {song.name}
                    </label>
                    <button 
                        col="1" 
                        className="mx-2"
                        onTap={() => onToggleFavorite(song)}
                    >
                        {favorites.has(song.path) ? '❤️' : '🤍'}
                    </button>
                    <button 
                        col="2"
                        className="text-green-500"
                        onTap={() => onAddToQueue(song)}
                    >
                        ➕
                    </button>
                </gridLayout>
            ))}
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});