import {createFileRoute} from '@tanstack/react-router';
import TrackDetailPage from '../../pages/track-detail-page.tsx';

export const Route = createFileRoute('/track-detail/$trackId')({
    component: TrackDetailPage
})
