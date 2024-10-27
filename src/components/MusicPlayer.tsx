import { File, knownFolders, MediaPlayer } from '@nativescript/core';
import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-nativescript";

export function MusicPlayer() {
    const [songs, setSongs] = useState<File[]>([]);
    const [currentSong, setCurrentSong] = useState<File | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player] = useState(() => new MediaPlayer());

    useEffect(() => {
        loadSongs();
        return () => {
            player.dispose();
        };
    }, []);

    const loadSongs = () => {
        const musicFolder = knownFolders.documents();
        const musicFiles = musicFolder.getEntities()
            .filter(entity => {
                const extension = entity.name.split('.').pop()?.toLowerCase();
                return extension === 'mp3' || extension === 'm4a' || extension === 'wav';
            });
        setSongs(musicFiles as File[]);
    };

    const playMusic = async (song: File) => {
        try {
            player.pause();
            setCurrentSong(song);
            
            player.volume = 1;
            player.audioFile = song.path;
            
            player.play();
            setIsPlaying(true);

            player.on('completed', () => {
                setIsPlaying(false);
            });
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else if (currentSong) {
            player.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <flexboxLayout style={styles.container}>
            <label className="text-2xl font-bold mb-4">Music Player</label>
            
            <scrollView style={styles.songList}>
                {songs.length === 0 ? (
                    <label className="text-center p-4">
                        No music files found. Add some music files to your device's Documents folder.
                    </label>
                ) : (
                    songs.map((song, index) => (
                        <button
                            key={index}
                            className={`p-4 mb-2 rounded-lg ${currentSong === song ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onTap={() => playMusic(song)}
                        >
                            {song.name}
                        </button>
                    ))
                )}
            </scrollView>

            {currentSong && (
                <flexboxLayout style={styles.controls}>
                    <label className="text-lg mb-2">
                        Now Playing: {currentSong.name}
                    </label>
                    <button
                        className={`p-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        onTap={togglePlayPause}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                </flexboxLayout>
            )}
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        padding: 16,
    },
    songList: {
        flex: 1,
        marginBottom: 16,
    },
    controls: {
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
});