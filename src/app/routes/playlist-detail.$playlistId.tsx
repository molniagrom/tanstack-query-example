import {createFileRoute} from '@tanstack/react-router';
import PlaylistDetailPage from '../../pages/playlist-detail-page.tsx';

export const Route = createFileRoute('/playlist-detail/$playlistId')({
    component: PlaylistDetailPage
})
