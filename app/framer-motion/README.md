pn# Framer Motion 动画库集成

## 安装

```bash
pnpm add framer-motion
```

## 基本用法

1. 导入 `motion` 组件

```tsx
import { motion } from "framer-motion";
```

2. 使用动画组件

```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  淡入效果
</motion.div>
```

## 常见动画模式

- **淡入淡出**: 使用 `opacity` 属性
- **滑动**: 使用 `x` 或 `y` 属性
- **缩放**: 使用 `scale` 属性
- **悬停/点击效果**: 使用 `whileHover` 和 `whileTap` 属性
- **拖动手势**: 使用 `drag` 和 `dragConstraints` 属性
- **动画序列**: 使用嵌套动画和 `transition.delay` 属性
- **视口动画**: 使用 `whileInView` 和 `viewport` 属性
- **响应式动画**: 结合 `useState` 和窗口大小检测

## 示例代码

查看本目录下的 `page.tsx` 文件获取完整示例，包含以下动画效果：

1. 基础动画（淡入、滑动、弹性）
2. 悬停/点击交互效果
3. 拖动手势控制
4. 嵌套动画序列
5. 视口滚动触发动画
6. 响应式布局动画
