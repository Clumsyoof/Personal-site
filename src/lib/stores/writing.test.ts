import { describe, it, expect } from 'bun:test';
import { get } from 'svelte/store';
import {
	createWritingStore,
	findPostBySlug,
	resolveSelectedSlug,
} from './writing.ts';
import type { Post } from '../posts.ts';

const firstPost: Post = {
	title: 'First Post',
	slug: 'first-post',
	date: '2026.08.01',
	description: 'A test post about SIMD',
	tags: ['c++', 'simd'],
	readingTime: '3 min read',
	html: '<h1>First Post</h1><p>Content of first post</p>',
};

const secondPost: Post = {
	title: 'Second Post',
	slug: 'second-post',
	date: '2026.08.15',
	description: 'Cellular automata simulation',
	tags: ['graphics', 'simulation'],
	readingTime: '5 min read',
	html: '<h1>Second Post</h1><p>Content of second post</p>',
};

const mockPosts: Post[] = [firstPost, secondPost];

describe('writing store logic', () => {
	it('findPostBySlug returns correct post or null', () => {
		expect(findPostBySlug(mockPosts, 'first-post')).toEqual(firstPost);
		expect(findPostBySlug(mockPosts, 'second-post')).toEqual(secondPost);
		expect(findPostBySlug(mockPosts, 'non-existent')).toBeNull();
		expect(findPostBySlug(mockPosts, null)).toBeNull();
		expect(findPostBySlug([], 'first-post')).toBeNull();
	});

	it('resolveSelectedSlug handles fallback to first post', () => {
		expect(resolveSelectedSlug(mockPosts, 'second-post')).toBe('second-post');
		expect(resolveSelectedSlug(mockPosts, 'invalid-slug')).toBe('first-post');
		expect(resolveSelectedSlug(mockPosts, null)).toBe('first-post');
		expect(resolveSelectedSlug([], null)).toBeNull();
	});

	it('initializes store with empty posts', () => {
		const store = createWritingStore();
		expect(get(store.posts)).toEqual([]);
		expect(get(store.selectedSlug)).toBeNull();
		expect(get(store.selectedPost)).toBeNull();
	});

	it('initializes store with posts and auto-selects first post', () => {
		const store = createWritingStore(mockPosts);
		expect(get(store.posts)).toEqual(mockPosts);
		expect(get(store.selectedSlug)).toBe('first-post');
		expect(get(store.selectedPost)).toEqual(firstPost);
	});

	it('allows selecting a post by slug or object', () => {
		const store = createWritingStore(mockPosts);
		store.selectPost('second-post');
		expect(get(store.selectedSlug)).toBe('second-post');
		expect(get(store.selectedPost)).toEqual(secondPost);

		store.selectPost(firstPost);
		expect(get(store.selectedSlug)).toBe('first-post');
		expect(get(store.selectedPost)).toEqual(firstPost);
	});

	it('updates posts via setPosts and preserves valid selection', () => {
		const store = createWritingStore(mockPosts, 'second-post');
		expect(get(store.selectedSlug)).toBe('second-post');

		const thirdPost: Post = {
			title: 'Third Post',
			slug: 'third-post',
			date: '2026.08.20',
			readingTime: '2 min read',
			html: '<p>Third</p>',
		};
		const updatedPosts = [...mockPosts, thirdPost];

		store.setPosts(updatedPosts);
		expect(get(store.posts)).toHaveLength(3);
		expect(get(store.selectedSlug)).toBe('second-post');
	});

	it('clears selection via clearSelection', () => {
		const store = createWritingStore(mockPosts);
		store.clearSelection();
		expect(get(store.selectedSlug)).toBeNull();
		expect(get(store.selectedPost)).toBeNull();
	});
});
