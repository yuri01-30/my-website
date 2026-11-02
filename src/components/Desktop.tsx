import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Entry } from '../data/types';
import { desktopEntries } from '../data/filesystem';
import { DesktopIcon, Icon, FileIcon, FolderIcon } from './Icons';
import { Content } from './Content';
import { FloatingComments } from './FloatingComments';
type OpenWindow = {
    entry: Entry;
    x: number;
    y: number;
    z: number;
    minimized: boolean;
    maximized: boolean;
};
export function WindowTitleBar({ entry, onDrag, onMinimize, onMaximize, onClose }: {
    entry: Entry;
    onDrag: (e: PointerEvent) => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
}) { return <header className="titlebar" onPointerDown={onDrag} onDoubleClick={onMaximize}><Icon entry={entry} /><strong>{entry.label}</strong><div className="window-controls" onPointerDown={e => e.stopPropagation()} onDoubleClick={e => e.stopPropagation()}><button aria-label="最小化" onClick={onMinimize}>_</button><button aria-label="最大化・元に戻す" onClick={onMaximize}>□</button><button aria-label="閉じる" onClick={onClose}>×</button></div></header>; }
export function Window({ win, active, onFocus, onChange, onClose, onOpen }: {
    win: OpenWindow;
    active: boolean;
    onFocus: () => void;
    onChange: (p: Partial<OpenWindow>) => void;
    onClose: () => void;
    onOpen: (e: Entry) => void;
}) {
    const [list, setList] = useState(false); const [menu, setMenu] = useState(''); const drag = useRef<{
        x: number;
        y: number;
        startX: number;
        startY: number;
    } | null>(null); return <section role="dialog" aria-label={win.entry.label} className={'window ' + (active ? 'active ' : '') + (win.maximized ? 'maximized' : '')} style={{ left: win.x, top: win.y, zIndex: win.z, display: win.minimized ? 'none' : undefined }} onPointerDown={onFocus} onKeyDown={e => {
        if (e.key === 'Escape') {
            if (menu)
                setMenu('');
            else
                onClose();
        }
    }} onPointerMove={e => {
        if (!drag.current)
            return; onChange({ x: Math.max(0, Math.min(innerWidth - 100, drag.current.x + e.clientX - drag.current.startX)), y: Math.max(0, Math.min(innerHeight - 100, drag.current.y + e.clientY - drag.current.startY)) });
    }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}><WindowTitleBar entry={win.entry} onDrag={e => {
        if (e.button !== 0 || win.maximized || matchMedia('(max-width: 640px)').matches)
            return; drag.current = { x: win.x, y: win.y, startX: e.clientX, startY: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId);
    }} onMinimize={() => onChange({ minimized: true })} onMaximize={() => onChange({ maximized: !win.maximized })} onClose={onClose} /><nav className="menubar"><button onClick={() => setMenu(menu === 'file' ? '' : 'file')}>File</button><button onClick={() => setMenu(menu === 'view' ? '' : 'view')}>View</button><button onClick={() => setMenu(menu === 'help' ? '' : 'help')}>Help</button>{menu && <div className="dropdown">{menu === 'file' ? <><button onClick={() => { onChange({ minimized: true }); setMenu(''); }}>最小化</button><button onClick={onClose}>閉じる</button></> : menu === 'view' ? <><button onClick={() => { setList(!list); setMenu(''); }}>{list ? 'アイコン表示' : '一覧表示'}</button><button onClick={() => { onChange({ maximized: !win.maximized }); setMenu(''); }}>最大化 / 元に戻す</button></> : <p>PC：ダブルクリックで開く<br />スマートフォン：タップで開く<br />Enter：開く / Esc：閉じる<br />タイトルバー：ドラッグで移動</p>}</div>}</nav><div className="address"><span>Address</span><Icon entry={win.entry} /><span>C:\ CREATIVE DESKTOP \ {win.entry.label}</span></div><div className="window-content"><Content entry={win.entry} onOpen={onOpen} list={list} /></div><footer className="statusbar"><span>{win.entry.children ? win.entry.children.length + ' 個の項目' : win.entry.kind === 'trash' ? '0 個の項目' : '準備完了'}</span><span>Creative Desktop</span><i>◢</i></footer></section>;
}
export function Taskbar({ windows, active, onRestore, onCloseAll, start, setStart }: {
    windows: OpenWindow[];
    active: number;
    onRestore: (id: string) => void;
    onCloseAll: () => void;
    start: boolean;
    setStart: (v: boolean) => void;
}) { const [time, setTime] = useState(new Date()); useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []); return <footer className="taskbar"><button className={'start ' + (start ? 'pressed' : '')} onClick={() => setStart(!start)}><FileIcon kind="profile" /><b>Start</b></button><div className="task-items">{windows.map(w => <button key={w.entry.id} className={w.z === active && !w.minimized ? 'pressed' : ''} onClick={() => onRestore(w.entry.id)}><Icon entry={w.entry} /><span>{w.entry.label}</span></button>)}</div><button className="close-all" type="button" onClick={onCloseAll} disabled={!windows.length} aria-label="すべてのウィンドウを閉じる" title="すべてのウィンドウを閉じる">×</button><div className="clock"><span className="connection" title="ローカル時刻">▥</span><time dateTime={time.toISOString()}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div></footer>; }
export function Desktop() {
    const [windows, setWindows] = useState<OpenWindow[]>([]); const z = useRef(1); const [selected, setSelected] = useState(''); const [start, setStart] = useState(false); const active = Math.max(0, ...windows.filter(w => !w.minimized).map(w => w.z)); function open(entry: Entry) { setStart(false); setWindows(current => { const existing = current.find(w => w.entry.id === entry.id); return existing ? current.map(w => w === existing ? { ...w, minimized: false, z: ++z.current } : w) : [...current, { entry, x: Math.max(0, Math.min(innerWidth - 650, 210 + (current.length % 6) * 28)), y: 68 + (current.length % 6) * 26, z: ++z.current, minimized: false, maximized: false }]; }); } function change(id: string, patch: Partial<OpenWindow>) { setWindows(current => current.map(w => w.entry.id === id ? { ...w, ...patch } : w)); } useEffect(() => { const resize = () => setWindows(current => current.map(w => ({ ...w, x: Math.max(0, Math.min(innerWidth - 100, w.x)), y: Math.max(0, Math.min(innerHeight - 100, w.y)) }))); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []); return <main className="desktop" onPointerDown={e => {
        if (e.target === e.currentTarget) {
            setSelected('');
            setStart(false);
        }
    }}><FloatingComments /><div className="desktop-icons">{desktopEntries.filter(e => e.id !== 'trash').map(entry => <DesktopIcon key={entry.id} entry={entry} selected={selected === entry.id} onSelect={() => setSelected(entry.id)} onOpen={() => open(entry)} />)}<a className="desktop-icon shop-folder" href="https://citris.booth.pm/" target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} aria-label="グッズショップを開く"><FolderIcon /><span>GOODS SHOP</span></a><a className="desktop-icon shop-folder" href="https://skeb.jp/@piuxy_2" target="_blank" rel="noopener noreferrer" onPointerDown={e => e.stopPropagation()} aria-label="Skebを開く"><FolderIcon /><span>Skeb</span></a></div><div className="visitor-counter" aria-label="訪問者カウンター"><span>あなたは</span><strong>1520</strong><span>人目の訪問者です</span></div><div className="trash-icon"><DesktopIcon entry={desktopEntries.find(entry => entry.id === 'trash')!} selected={selected === 'trash'} onSelect={() => setSelected('trash')} onOpen={() => open(desktopEntries.find(entry => entry.id === 'trash')!)} /></div>{windows.map(win => <Window key={win.entry.id} win={win} active={win.z === active} onFocus={() => {
        if (win.z !== active)
            change(win.entry.id, { z: ++z.current });
    }} onChange={patch => change(win.entry.id, patch)} onClose={() => setWindows(current => current.filter(w => w.entry.id !== win.entry.id))} onOpen={open} />)}{start && <nav className="start-menu"><div className="start-side">PIU <b>OS</b></div><div><header>ぴう！</header>{desktopEntries.map(e => <button key={e.id} onClick={() => open(e)}><Icon entry={e} /><span>{e.label}</span><span>›</span></button>)}<footer>Creative Desktop · 1.0</footer></div></nav>}<Taskbar windows={windows} active={active} onRestore={id => change(id, { minimized: false, z: ++z.current })} onCloseAll={() => { setWindows([]); setStart(false); }} start={start} setStart={setStart} /></main>;
}
