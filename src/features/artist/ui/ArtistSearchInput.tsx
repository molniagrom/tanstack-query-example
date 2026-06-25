import {useEffect, useRef, useState} from "react";
import {useSearchArtistsQuery} from "../api/use-search-artists-query.ts";

type Artist = { id: string; name: string }

type Props = {
    selectedArtists: Artist[]
    onAdd: (artist: Artist) => void
    onRemove: (artistId: string) => void
    onCreate?: (name: string) => void
}

export const ArtistSearchInput = ({selectedArtists, onAdd, onRemove, onCreate}: Props) => {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const {data: artists} = useSearchArtistsQuery(search)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (artist: Artist) => {
        if (!selectedArtists.some(a => a.id === artist.id)) {
            onAdd(artist)
        }
        setSearch("")
        setIsOpen(false)
    }

    const filteredArtists = artists?.filter(a => !selectedArtists.some(s => s.id === a.id)) ?? []

    return (
        <div ref={wrapperRef} style={{position: "relative"}}>
            <div style={{display: "flex", flexWrap: "wrap", gap: 4, minHeight: 36, padding: "4px 8px", border: "1px solid rgba(113, 128, 150, 0.3)", borderRadius: 12, background: "rgba(255, 252, 245, 0.94)"}}>
                {selectedArtists.map(artist => (
                    <span key={artist.id} style={{display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 8, background: "rgba(229, 169, 60, 0.15)", fontSize: "0.85rem"}}>
                        {artist.name}
                        <button type="button" onClick={() => onRemove(artist.id)} style={{background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "inherit"}}>×</button>
                    </span>
                ))}
                <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setIsOpen(true) }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={selectedArtists.length === 0 ? "Search artists..." : ""}
                    style={{flex: 1, minWidth: 80, border: "none", outline: "none", background: "transparent", fontSize: "inherit", font: "inherit", color: "inherit"}}
                />
            </div>
            {isOpen && search.length >= 2 && (
                <div style={{position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, maxHeight: 200, overflowY: "auto", border: "1px solid rgba(113, 128, 150, 0.3)", borderRadius: 12, background: "rgba(255, 252, 245, 0.98)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10}}>
                    {filteredArtists.map(artist => (
                        <button
                            key={artist.id}
                            type="button"
                            onClick={() => handleSelect(artist)}
                            style={{display: "block", width: "100%", padding: "8px 12px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "0.9rem"}}
                        >
                            {artist.name}
                        </button>
                    ))}
                    {filteredArtists.length === 0 && onCreate && (
                        <button
                            type="button"
                            onClick={() => { onCreate(search); setSearch(""); setIsOpen(false) }}
                            style={{display: "block", width: "100%", padding: "8px 12px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "0.9rem", color: "var(--text-soft)"}}
                        >
                            Create "{search}"
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
