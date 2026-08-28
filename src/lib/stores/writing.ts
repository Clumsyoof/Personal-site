import { writable, derived, type Readable, type Writable } from 'svelte/store';
import type { Post } from '../posts.ts';

export interface WritingState {
	posts: Post[];
	selectedSlug: string | null;
}

/**
 * Pure logic function: find post by slug in a list of posts
 */
export function findPostBySlug(posts: Post[], slug: string | null): Post | null {
	if (!slug || !posts || posts.length === 0) return null;
	return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * Pure logic function: determine the next valid slug given current posts and a desired slug
 */
export function resolveSelectedSlug(posts: Post[], desiredSlug: string | null): string | null {
	if (!posts || posts.length === 0) return null;
	if (desiredSlug && posts.some((p) => p.slug === desiredSlug)) {
		return desiredSlug;
	}
	return posts[0]?.slug ?? null;
}

/**
 * Creates an isolated writing store instance managing state and actions.
 */
export function createWritingStore(initialPosts: Post[] = [], initialSlug: string | null = null) {
	const initialSelected = resolveSelectedSlug(initialPosts, initialSlug);

	const state: Writable<WritingState> = writable({
		posts: initialPosts,
		selectedSlug: initialSelected,
	});

	const posts: Readable<Post[]> = derived(state, ($s) => $s.posts);
	const selectedSlug: Readable<string | null> = derived(state, ($s) => $s.selectedSlug);
	const selectedPost: Readable<Post | null> = derived(state, ($s) =>
		findPostBySlug($s.posts, $s.selectedSlug)
	);

	function setPosts(newPosts: Post[]) {
		state.update((s) => {
			const nextSlug = resolveSelectedSlug(newPosts, s.selectedSlug);
			return {
				posts: newPosts,
				selectedSlug: nextSlug,
			};
		});
	}

	function selectPost(slugOrPost: string | Post) {
		const slug = typeof slugOrPost === 'string' ? slugOrPost : slugOrPost.slug;
		state.update((s) => ({
			...s,
			selectedSlug: slug,
		}));
	}

	function clearSelection() {
		state.update((s) => ({
			...s,
			selectedSlug: null,
		}));
	}

	return {
		subscribe: state.subscribe,
		posts,
		selectedSlug,
		selectedPost,
		setPosts,
		selectPost,
		clearSelection,
	};
}

export type WritingStore = ReturnType<typeof createWritingStore>;

export const writingStore: WritingStore = createWritingStore();
