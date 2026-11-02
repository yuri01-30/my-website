import { characters, type Character } from './characters';
import { gallery } from './gallery';
import type { Entry, ImageRecord } from './types';
export const imagesToEntries = (images: ImageRecord[], prefix: string): Entry[] => images.map(image => ({ id: prefix + '/' + image.id, label: image.title, kind: 'image', image }));
const characterFolder = (c: Character, prefix = 'characters'): Entry => ({ id: prefix + '/' + c.id, label: c.name, kind: 'folder', subtitle: 'CHARACTER PROFILE', icon: '/images/' + (c.id === 'sorakaze' ? 'sano' : c.id) + '_icon.png', character: c });
export const desktopEntries: Entry[] = [{ id: 'profile', label: 'PROFILE', kind: 'profile', subtitle: '私について' }, { id: 'characters', label: 'CHARACTERS', kind: 'folder', subtitle: '自創作の子たち', children: characters.map(c => characterFolder(c)) }, { id: 'gallery', label: 'GALLERY', kind: 'folder', subtitle: 'イラストの保管庫', children: imagesToEntries(gallery, 'gallery') }, { id: 'links', label: 'LINKS', kind: 'links', subtitle: '外部リンク' }, { id: 'trash', label: 'TRASH', kind: 'trash' }];
