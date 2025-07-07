import React from 'react'

const HomePage = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        Tailwind CSS v4 配置测试
      </h1>
      
      {/* 测试品牌颜色 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">品牌颜色测试</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-brand rounded-lg flex items-center justify-center text-white text-sm">
            brand
          </div>
          <div className="w-20 h-20 bg-brand-100 rounded-lg flex items-center justify-center text-white text-sm">
            brand-100
          </div>
        </div>
      </div>

      {/* 测试自定义颜色 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">自定义颜色测试</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-red rounded-lg flex items-center justify-center text-white text-sm">
            red
          </div>
          <div className="w-20 h-20 bg-green rounded-lg flex items-center justify-center text-white text-sm">
            green
          </div>
          <div className="w-20 h-20 bg-blue rounded-lg flex items-center justify-center text-white text-sm">
            blue
          </div>
          <div className="w-20 h-20 bg-pink rounded-lg flex items-center justify-center text-black text-sm">
            pink
          </div>
          <div className="w-20 h-20 bg-orange rounded-lg flex items-center justify-center text-white text-sm">
            orange
          </div>
        </div>
      </div>

      {/* 测试 Light 颜色 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Light 颜色测试</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-light-100 rounded-lg flex items-center justify-center text-white text-xs">
            light-100
          </div>
          <div className="w-20 h-20 bg-light-200 rounded-lg flex items-center justify-center text-white text-xs">
            light-200
          </div>
          <div className="w-20 h-20 bg-light-300 rounded-lg flex items-center justify-center text-black text-xs">
            light-300
          </div>
          <div className="w-20 h-20 bg-light-400 rounded-lg flex items-center justify-center text-black text-xs">
            light-400
          </div>
        </div>
      </div>

      {/* 测试阴影 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">阴影测试</h2>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-white shadow-drop-1 rounded-lg flex items-center justify-center text-sm">
            drop-1
          </div>
          <div className="w-20 h-20 bg-white shadow-drop-2 rounded-lg flex items-center justify-center text-sm">
            drop-2
          </div>
          <div className="w-20 h-20 bg-white shadow-drop-3 rounded-lg flex items-center justify-center text-sm">
            drop-3
          </div>
        </div>
      </div>

      {/* 测试动画 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">动画测试</h2>
        <div className="w-20 h-20 bg-brand rounded-lg flex items-center justify-center text-white animate-caret-blink">
          blink
        </div>
      </div>

      {/* 测试字体 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">字体测试</h2>
        <p className="font-poppins text-lg">
          这是使用 Poppins 字体的文本测试 - Testing Poppins Font
        </p>
      </div>

      {/* 测试原有的 main-content 类 */}
      <div className="main-content">
        <p>这是测试 main-content 类的区域，应该有浅色背景和圆角</p>
      </div>
    </div>
  )
}

export default HomePage
