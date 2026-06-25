import {createFileRoute} from "@tanstack/react-router";
import TracksPage from "../../pages/tracks-page.tsx";

export const Route = createFileRoute('/tracks')({
    component: TracksPage
})
