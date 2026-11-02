import { useMemo } from 'react';
import { floatingComments } from '../data/comments';

type FloatingComment = {
    id: number;
    text: string;
    top: number;
    delay: number;
    duration: number;
};

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export function FloatingComments() {
    const comments = useMemo<FloatingComment[]>(() => floatingComments.map((text, id) => ({
        id,
        text,
        top: randomBetween(8, 82),
        delay: randomBetween(-18, 0),
        duration: randomBetween(14, 25),
    })), []);

    if (!comments.length)
        return null;

    return <div className="floating-comments" aria-hidden="true">
        {comments.map(comment => <span
            className="floating-comment"
            key={comment.id}
            style={{
                top: `${comment.top}%`,
                animationDelay: `${comment.delay}s`,
                animationDuration: `${comment.duration}s`,
            }}
        >{comment.text}</span>)}
    </div>;
}
