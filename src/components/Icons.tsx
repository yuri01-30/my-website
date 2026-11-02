import type { Entry } from '../data/types';
export function FolderIcon() { return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="M3 9V4h17l5 5h19v26H3z" fill="#cb9129" stroke="#735722"/><path d="M4 10h40v25H4z" fill="#f9d66d" stroke="#956d2e"/><path d="M2 14h44l-4 23H5z" fill="#ffe490" stroke="#926c32"/><path d="M5 16h37" stroke="#fff7ce" strokeWidth="2"/></svg>; }
export function FileIcon({ kind = 'text' }: {
    kind?: string;
}) { return <svg viewBox="0 0 48 44" aria-hidden="true">{kind === 'profile' ? <><rect x="4" y="5" width="40" height="31" fill="#d6d9de" stroke="#34445c"/><rect x="7" y="8" width="34" height="23" fill="#7cc6ed"/><circle cx="24" cy="16" r="5" fill="#fff6d9"/><path d="M14 29q0-12 10-9 10-3 10 9" fill="#376ea9"/><path d="M19 36v5h-7 24-7v-5" fill="#c4c6cc" stroke="#34445c"/></> : kind === 'trash' ? <><path d="M12 11h26l-3 30H15z" fill="#dbe9e9" stroke="#5e7981"/><path d="M10 8h30v5H10zM20 5h10v3H20z" fill="#eefbff" stroke="#5e7981"/><path d="M20 17v18m6-18v18m6-18v18" stroke="#829fa5"/></> : kind === 'links' ? <><circle cx="24" cy="23" r="18" fill="#60b8eb" stroke="#215e93"/><ellipse cx="24" cy="23" rx="8" ry="18" fill="none" stroke="#dcf4ed"/><path d="M7 18h34M8 29h32M24 5v36" stroke="#dcf4ed"/><path d="m10 14 8-7 4 8-5 7-8-2m19 7 10-5-2 11-9 5" fill="#8cb875"/></> : <><path d="M10 3h22l8 8v30H10z" fill="#fffef1" stroke="#566778"/><path d="M32 3v9h8" fill="#b5d1e6" stroke="#566778"/>{kind === 'image' ? <><rect x="14" y="17" width="22" height="18" fill="#9cd3ef"/><path d="m14 33 8-10 5 6 4-4 5 10H14" fill="#73a84f"/><circle cx="31" cy="21" r="3" fill="#fff5bd"/></> : <path d="M15 18h19M15 23h19M15 28h19M15 33h13" stroke="#7e94a8"/>}</>}</svg>; }
export function Icon({ entry }: {
    entry: Entry;
}) { return entry.icon ? <img className="entry-icon" src={entry.icon} alt="" aria-hidden="true" /> : entry.kind === 'folder' ? <FolderIcon /> : <FileIcon kind={entry.kind}/>; }
export function DesktopIcon({ entry, selected, onSelect, onOpen }: {
    entry: Entry;
    selected: boolean;
    onSelect: () => void;
    onOpen: () => void;
}) { return <button className={'desktop-icon ' + (selected ? 'selected' : '')} onClick={onSelect} onDoubleClick={onOpen} onPointerUp={e => { if (e.pointerType === 'touch' || e.pointerType === 'pen')
    onOpen(); }} onKeyDown={e => { if (e.key === 'Enter') {
    e.preventDefault();
    onOpen();
} }} aria-label={entry.label + ' を開く'}><Icon entry={entry}/><span>{entry.label}</span></button>; }
