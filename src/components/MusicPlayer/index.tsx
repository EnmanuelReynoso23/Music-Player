import { Application, Color, File, knownFolders, MediaPlayer } from '@nativescript/core';
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-nativescript";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { Queue } from "./Queue";

export function MusicPlayer() {
    const [songs, setSongs] = useState<File[]>([]);
    const [queue, setQueue] = useState<File[]>([]);
    const [currentSong, setCurrentSong] = useState<File | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [player] = useState(() => new MediaPlayer());

    useEffect(() => {
        loadSongs();
        setupBackgroundAudio();
        
        // Set up time update interval
        const interval = setInterval(() => {
            if (player && isPlaying) {
                setCurrentTime(player.currentTime);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            player.dispose();
        };
    }, []);

    const setupBackgroundAudio = () => {
        if (Application.android) {
            // Enable background audio for Android
            android.app.Activity.prototype.onStop = function() {
                // Keep the audio playing when the app is in background
            };
        }
    };

    const loadSongs = () => {
        const musicFolder = knownFolders.documents();
        const musicFiles = musicFolder.getEntities()
            .filter(entity => {
                const extension = entity.name.split('.').pop()?.toLowerCase();
                return extension === 'mp3' || extension === 'm4a' || extension === 'wav';
            });
        setSongs(musicFiles as File[]);
        setQueue(musicFiles as File[]);
    };

    const playMusic = async (song: File, index: number) => {
        try {
            player.pause();
            setCurrentSong(song);
            setCurrentIndex(index);
            
            player.volume = isMuted ? 0 : volume;
            player.audioFile = song.path;
            player.rate = playbackRate;
            
            player.play();
            setIsPlaying(true);
            setDuration(player.duration);

            player.on('completed', () => {
                handleSongEnd();
            });
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const handleSongEnd = () => {
        if (repeatMode === 'one') {
            playMusic(currentSong!, currentIndex);
        } else if (repeatMode === 'all' || currentIndex < queue.length - 1) {
            playNext();
        } else {
            setIsPlaying(false);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else if (currentSong) {
            player.play();
        } else if (queue.length > 0) {
            playMusic(queue[0], 0);
        }
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        if (queue.length === 0) return;
        
        let nextIndex = currentIndex + 1;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else if (nextIndex >= queue.length) {
            nextIndex = 0;
        }
        
        playMusic(queue[nextIndex], nextIndex);
    };

    const playPrevious = () => {
        if (queue.length === 0) return;
        
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = queue.length - 1;
        }
        
        playMusic(queue[prevIndex], prevIndex);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const toggleRepeat = () => {
        const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (!isMuted) {
            player.volume = newVolume;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        player.volume = isMuted ? volume : 0;
    };

    const handlePlaybackRateChange = (rate: number) => {
        setPlaybackRate(rate);
        player.rate = rate;
    };

    const handleSeek = (position: number) => {
        player.seekTo(position);
        setCurrentTime(position);
    };

    const toggleFavorite = (song: File) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(song.path)) {
            newFavorites.delete(song.path);
        } else {
            newFavorites.add(song.path);
        }
        setFavorites(newFavorites);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const addToQueue = (song: File) => {
        setQueue([...queue, song]);
    };

    const removeFromQueue = (index: number) => {
        const newQueue = [...queue];
        newQueue.splice(index, 1);
        setQueue(newQueue);
    };

    return (
        <flexboxLayout style={[styles.container, isDarkMode && styles.darkMode]}>
            <button 
                className={`self-end p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                onTap={toggleTheme}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>

            {currentSong && (
                <>
                    <label className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Now Playing: {currentSong.name}
                    </label>
                    
                    <ProgressBar
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={handleSeek}
                    />
                </>
            )}

            <Controls
                isPlaying={isPlaying}
                isShuffle={isShuffle}
                repeatMode={repeatMode}
                volume={volume}
                isMuted={isMuted}
                playbackRate={playbackRate}
                onPlayPause={togglePlayPause}
                onNext={playNext}
                onPrevious={playPrevious}
                onShuffle={toggleShuffle}
                onRepeat={toggleRepeat}
                onVolumeChange={handleVolumeChange}
                onMute={toggleMute}
                onPlaybackRateChange={handlePlaybackRateChange}
            />

            <Queue
                songs={songs}
                currentSong={currentSong}
                queue={queue}
                onSongSelect={(song) => playMusic(song, queue.indexOf(song))}
                onAddToQueue={addToQueue}
                onRemoveFromQueue={removeFromQueue}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
            />
        </flexboxLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
        padding: 16,
        backgroundColor: new Color("#ffffff"),
    },
    darkMode: {
        backgroundColor: new Color("#1a1a1a"),
    },
});