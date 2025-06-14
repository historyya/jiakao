import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface TocToggleProps {
  contentId: string;
  position: "desktop" | "mobile";
}

export default function TocToggle({ contentId, position }: TocToggleProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 只有桌面版本需要记住状态
    if (position === "desktop") {
      // 从localStorage读取初始状态
      const savedState = localStorage.getItem("tocVisible");
      if (savedState !== null) {
        setIsVisible(savedState === "true");
      }
    }

    // 同步DOM状态
    const tocContent = document.getElementById(contentId);
    if (tocContent) {
      if (!isVisible) {
        tocContent.classList.add("hidden");
      } else {
        tocContent.classList.remove("hidden");
      }
    }
  }, [contentId, position]);

  const toggleToc = () => {
    const newState = !isVisible;
    setIsVisible(newState);

    // 保存状态到localStorage (仅桌面版)
    if (position === "desktop") {
      localStorage.setItem("tocVisible", String(newState));
    }

    // 更新DOM
    const tocContent = document.getElementById(contentId);
    if (tocContent) {
      if (newState) {
        tocContent.classList.remove("hidden");
      } else {
        tocContent.classList.add("hidden");
      }
    }
  };

  return (
    <motion.button
      onClick={toggleToc}
      className={
        position === "desktop"
          ? "absolute -left-10 top-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-l-md shadow-md flex items-center justify-center"
          : "bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      }
      aria-label={isVisible ? "隐藏目录" : "显示目录"}
      title={isVisible ? "隐藏目录" : "显示目录"}
      whileHover={{ backgroundColor: "#2563EB" }}
      whileTap={{ scale: 0.95 }}
    >
      {isVisible ? (
        <motion.svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </motion.svg>
      ) : (
        <motion.svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
