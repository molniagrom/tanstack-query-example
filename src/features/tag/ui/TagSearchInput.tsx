import {useEffect, useRef, useState} from "react";
import {useSearchTagsQuery} from "../api/use-search-tags-query.ts";

type Tag = { id: string; type: string; attributes: { name: string } }

type Props = {
    selectedTags: Tag[]
    onAdd: (tag: Tag) => void
    onRemove: (tagId: string) => void
    onCreate?: (name: string) => void
}

export const TagSearchInput = ({selectedTags, onAdd, onRemove, onCreate}: Props) => {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const {data: tags} = useSearchTagsQuery(search)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (tag: Tag) => {
        if (!selectedTags.some(t => t.id === tag.id)) {
            onAdd(tag)
        }
        setSearch("")
        setIsOpen(false)
    }

    const filteredTags = tags?.filter(t => !selectedTags.some(s => s.id === t.id)) ?? []

    return (
        <div ref={wrapperRef} style={{position: "relative"}}>
            <div style={{display: "flex", flexWrap: "wrap", gap: 4, minHeight: 36, padding: "4px 8px", border: "1px solid rgba(113, 128, 150, 0.3)", borderRadius: 12, background: "rgba(255, 252, 245, 0.94)"}}>
                {selectedTags.map(tag => (
                    <span key={tag.id} style={{display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 8, background: "rgba(229, 169, 60, 0.15)", fontSize: "0.85rem"}}>
                        {tag.attributes.name}
                        <button type="button" onClick={() => onRemove(tag.id)} style={{background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "inherit"}}>×</button>
                    </span>
                ))}
                <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setIsOpen(true) }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={selectedTags.length === 0 ? "Search tags..." : ""}
                    style={{flex: 1, minWidth: 80, border: "none", outline: "none", background: "transparent", fontSize: "inherit", font: "inherit", color: "inherit"}}
                />
            </div>
            {isOpen && search.length >= 2 && (
                <div style={{position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, maxHeight: 200, overflowY: "auto", border: "1px solid rgba(113, 128, 150, 0.3)", borderRadius: 12, background: "rgba(255, 252, 245, 0.98)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10}}>
                    {filteredTags.map(tag => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleSelect(tag)}
                            style={{display: "block", width: "100%", padding: "8px 12px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "0.9rem"}}
                        >
                            {tag.attributes.name}
                        </button>
                    ))}
                    {filteredTags.length === 0 && onCreate && (
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
