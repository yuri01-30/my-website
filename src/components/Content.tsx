import { useState } from 'react';
import type { Character } from '../data/characters';
import type { Entry, ImageRecord } from '../data/types';
import { profile } from '../data/profile';
import { links } from '../data/links';
import { Icon, FileIcon, FolderIcon } from './Icons';
export function ImageViewer({ image }: {
    image: ImageRecord;
}) { const [failed, setFailed] = useState(false); return <div className="image-viewer">{image.src && !failed ? <img src={image.src} alt={image.title} onError={() => setFailed(true)} /> : <div className="image-placeholder"><FileIcon kind="image" /><strong>NO IMAGE YET</strong><span>イラストは、もう少し先に。</span><small>{image.title}</small></div>}{image.caption && <p>{image.caption}</p>}</div>; }
export function TextViewer({ text }: {
    text: string;
}) { return <pre className="text-viewer" tabIndex={0}>{text}</pre>; }
export function Explorer({ entry, onOpen, list }: {
    entry: Entry;
    onOpen: (e: Entry) => void;
    list: boolean;
}) {
    const [selected, setSelected] = useState(''); return <div className="explorer"><aside><FolderIcon /><h3>{entry.label}</h3><p>{entry.subtitle || 'このフォルダの中を探索する'}</p><hr /><small>{entry.children?.length ?? 0} 個の項目</small><p className="aside-note">ひとりひとりの<br />設定とか資料とか!</p></aside><div className={'file-area ' + (list ? 'list' : '')}>{entry.children?.length ? entry.children.map(item => <button key={item.id} className={'file ' + (selected === item.id ? 'selected' : '')} onClick={() => {
        setSelected(item.id); if (item.kind === 'image' || item.character)
            onOpen(item);
    }} onDoubleClick={() => onOpen(item)} onPointerUp={e => {
        if (e.pointerType === 'touch' || e.pointerType === 'pen')
            onOpen(item);
    }} onKeyDown={e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onOpen(item);
        }
    }}>{item.kind === 'image' && item.image?.src ? <Thumbnail image={item.image} /> : <Icon entry={item} />}<span>{item.label}</span></button>) : <div className="empty"><FolderIcon /><strong>there's nothing</strong><p>coming eventually...</p><small>0 ITEMS</small></div>}</div></div>;
}
function Thumbnail({ image }: {
    image: ImageRecord;
}) { const [failed, setFailed] = useState(false); return failed ? <FileIcon kind="image" /> : <img src={image.src} alt={image.title} onError={() => setFailed(true)} />; }
function HiddenDescription({ text, emphasis = [] }: {
    text: string;
    emphasis?: string[];
}) {
    if (!emphasis.length)
        return <>{text}</>;
    const pattern = new RegExp(`(${emphasis.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    return <>{text.split(pattern).map((part, index) => emphasis.includes(part) ? <span className="hidden-description-emphasis" key={index}>{part}</span> : part)}</>;
}
function CharacterProfile({ character, onOpen }: {
    character: Character;
    onOpen: (entry: Entry) => void;
}) {
    const [showHiddenDescription, setShowHiddenDescription] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const hasLongDescription = character.description.length > 240;
    const main: ImageRecord = { id: character.id, title: character.name, src: character.main };
    return <div className="character-profile">
        <div className="character-hero">
            <div className="character-main-image" onClick={() => onOpen({ id: character.id + '/main', label: 'main.png', kind: 'image', image: main })}>
                <Thumbnail image={main} />
            </div>
            <div className="character-heading">
                <small>CHARACTER FILE / {character.id.toUpperCase()}</small>
                <h1>{character.nameKanji || '漢字名を入力'}<span className="character-name-alphabet">{character.name}</span></h1>
                <p
                    id={`${character.id}-description`}
                    className={hasLongDescription && !showFullDescription ? 'character-description collapsed' : 'character-description'}
                >
                    {character.description}
                </p>
                {hasLongDescription && <button
                    className="description-toggle"
                    type="button"
                    aria-expanded={showFullDescription}
                    aria-controls={`${character.id}-description`}
                    onClick={() => setShowFullDescription(current => !current)}
                >
                    {showFullDescription ? '折りたたむ' : '全文を表示'}
                    <span aria-hidden="true">{showFullDescription ? ' ▲' : ' ▼'}</span>
                </button>}
                {character.hiddenDescription && <>
                    <button
                        className="hidden-description-toggle"
                        type="button"
                        aria-expanded={showHiddenDescription}
                        aria-controls={`${character.id}-hidden-description`}
                        onClick={() => setShowHiddenDescription(current => !current)}
                    >
                        {showHiddenDescription ? '閉じる' : 'じつは...'}
                        <span aria-hidden="true">{showHiddenDescription ? ' ▲' : ' ▼'}</span>
                    </button>
                    {showHiddenDescription && <p id={`${character.id}-hidden-description`} className="hidden-description"><HiddenDescription text={character.hiddenDescription} emphasis={character.hiddenDescriptionEmphasis} /></p>}
                </>}
            </div>
        </div>
        <div className="character-details">
            <dl>
                <dt>性別</dt><dd>{character.gender}</dd>
                <dt>年齢</dt><dd>{character.age}</dd>
                <dt>身長</dt><dd>{character.height}</dd>
                <dt>所属</dt><dd>{character.affiliation}</dd>
                <dt>MBTI</dt><dd>{character.mbti}</dd>
                <dt>イメソン</dt><dd>{/^https?:\/\//.test(character.imageSong) ? <a href={character.imageSong} target="_blank" rel="noopener noreferrer">{character.imageSong}</a> : character.imageSong}</dd>
            </dl>
            <section><h2>象徴的な要素</h2><p>{character.symbolicElements}</p></section>
            <section><h2>関係性</h2><p>{character.relationship}</p></section>
        </div>
        <section className="character-gallery">
            <h2>GALLERY <small>{character.gallery.length} ITEMS</small></h2>
            <div className="character-gallery-grid">{character.gallery.length ? character.gallery.map(image => <button key={image.id} onClick={() => onOpen({ id: character.id + '/gallery/' + image.id, label: image.title, kind: 'image', image })}><Thumbnail image={image} /><span>{image.title}</span></button>) : <p>ギャラリーは準備中です。</p>}</div>
        </section>
    </div>;
}
export function Content({ entry, onOpen, list }: {
    entry: Entry;
    onOpen: (e: Entry) => void;
    list: boolean;
}) {
    if (entry.character)
        return <CharacterProfile character={entry.character} onOpen={onOpen} />;
    if (entry.kind === 'folder')
        return <Explorer entry={entry} onOpen={onOpen} list={list} />; if (entry.kind === 'text')
        return <TextViewer text={entry.text ?? ''} />; if (entry.kind === 'image')
        return <ImageViewer key={entry.image?.src} image={entry.image ?? { id: entry.id, title: entry.label }} />; if (entry.kind === 'profile')
        return <div className="profile"><div className="profile-top"><div className="avatar">{profile.image ? <Thumbnail image={{ id: 'avatar', title: 'プロフィール画像', src: profile.image }} /> : <FileIcon kind="profile" />}</div><div><small>PERSONAL FILE / 001</small><h1>{profile.name}</h1><p>{profile.tagline}</p></div><span className="online">● ONLINE</span></div><p className="bio">{profile.bio}</p><dl><dt>好きなもの</dt><dd>{profile.likes}</dd><dt>好きなゲーム</dt><dd>{profile.games}</dd></dl><div className="profile-note">✧ {profile.note}</div></div>; if (entry.kind === 'links')
        return <div className="links"><h2>外部リンク</h2><p>覗いてみてね</p>{links.map(link => <div className="link-row" key={link.url}><FileIcon kind="links" /><div><strong>{link.name}</strong><p>{link.description}</p></div>{link.url ? <a href={link.url} target="_blank" rel="noopener noreferrer">開く ↗</a> : <span className="pending">準備中</span>}</div>)}</div>; return <div className="empty"><FileIcon kind="trash" /><strong>the trush is empty.</strong><p>there's nothing</p><small>0 ITEMS · 0 BYTES</small></div>;
}
