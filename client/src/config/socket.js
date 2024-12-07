import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8081';

export const socket = io(SOCKET_URL, {
    withCredentials: true,
    // reconnection: true,
    // reconnectionAttempts: 5,
    // reconnectionDelay: 1000
});

socket.on('connect', () => {
    console.log('Connected to socket server');
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});