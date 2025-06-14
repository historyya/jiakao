import { useState, useEffect } from "react";
import type { MarkdownHeading } from "astro";
import clsx from "clsx";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // 过滤并转换标题数据
  const tocItems = headings
    .filter((heading) => heading.depth > 1 && heading.depth < 5)
    .map((heading) => ({
      id: heading.slug,
      text: heading.text,
      level: heading.depth,
    }));

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前可见的标题
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0]);
        }
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    // 观察所有标题元素
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <nav aria-label="目录导航">
      <ul className="space-y-2 text-sm">
        {tocItems.map((heading) => (
          <li
            key={heading.id}
            className={clsx(
              "transition-colors",
              // 缩进逻辑
              heading.level === 2
                ? "pl-0"
                : heading.level === 3
                ? "pl-3"
                : "pl-6",
              // 激活状态
              activeId === heading.id
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                });
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
