import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type Tag = {
  tag: string;
  tagName: string;
};

export type TagWithCount = {
  tag: string;
  tagName: string;
  count: number;
};

/**
 * Builds a de-duplicated, sorted tag list with post count from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - `count` is the count of eligible posts containing this tag (matched by slug)
 */
export function getUniqueTagsWithCount(posts: CollectionEntry<"posts">[]): TagWithCount[] {
  const filteredPosts = posts.filter(postFilter);
  const tagMap = new Map<string, { tagName: string; count: number }>();

  filteredPosts.forEach(post => {
    const postTags = post.data.tags || [];
    const seenInPost = new Set<string>();

    postTags.forEach(rawTag => {
      if (!rawTag) return;
      const slug = slugifyStr(rawTag);
      if (seenInPost.has(slug)) return;
      seenInPost.add(slug);

      const existing = tagMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, { tagName: rawTag, count: 1 });
      }
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, { tagName, count }]) => ({ tag, tagName, count }))
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
}

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]): Tag[] {
  return getUniqueTagsWithCount(posts).map(({ tag, tagName }) => ({
    tag,
    tagName,
  }));
}
