export type ImageRecord = {
    id: string;
    title: string;
    src?: string;
    caption?: string;
};
import type { Character } from './characters';
export type Entry = {
    id: string;
    label: string;
    kind: 'folder' | 'text' | 'image' | 'profile' | 'links' | 'trash';
    subtitle?: string;
    icon?: string;
    text?: string;
    image?: ImageRecord;
    children?: Entry[];
    character?: Character;
};
