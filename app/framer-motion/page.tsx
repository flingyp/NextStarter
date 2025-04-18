"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function FramerMotionPage() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 mb-8 text-2xl font-bold"
        style={{ scale }}
      >
        Framer Motion 示例
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="p-8 mb-8 bg-yellow-500 rounded-lg"
      >
        视口滚动触发动画
      </motion.div>

      <motion.div
        animate={isMobile ? { x: 0 } : { x: 100 }}
        transition={{ type: "spring" }}
        className="p-8 mb-8 bg-pink-500 rounded-lg"
      >
        响应式布局动画
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-8 mb-8 bg-blue-500 rounded-lg cursor-pointer"
      >
        悬停/点击效果
      </motion.div>

      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="p-8 bg-green-500 rounded-lg"
      >
        弹性动画
      </motion.div>

      <motion.div
        className="p-8 mb-8 bg-purple-500 rounded-lg"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        whileDrag={{ scale: 1.1 }}
      >
        拖动手势
      </motion.div>

      <motion.div
        className="p-8 bg-red-500 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 1 }}
        >
          动画序列
        </motion.div>
      </motion.div>

      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="p-8 mb-8 bg-gray-200 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          滚动触发动画区块 {i + 1}
        </motion.div>
      ))}

      <div className="h-screen flex items-center justify-center">
        <motion.div
          className="p-8 bg-indigo-500 rounded-lg text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          页面底部动画
        </motion.div>
      </div>
    </div>
  );
}
