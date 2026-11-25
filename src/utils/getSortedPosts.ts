import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * 按原始发布时间倒序排列文章，编辑已有文章不会改变顺序。
 * 通过 postFilter() 继续过滤草稿和未到发布时间的文章。
 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.pubDatetime).getTime() / 1000
        )
    );
}
