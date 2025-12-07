# 菜头管理后台文档中心

欢迎来到菜头项目的文档中心。这里包含了项目开发、调试和维护的所有文档。

## 📚 文档目录

### 🚀 开发指南

- **[本地开发与验证指南](./LOCAL_DEVELOPMENT_GUIDE.md)** ⭐️ 推荐
  - 完整的本地环境搭建指南
  - 服务启动流程
  - 代码验证工作流程
  - 问题排查方法
  - **适合 AI 助手阅读和遵循**

- **[快速参考](./QUICK_REFERENCE.md)** ⚡️
  - 最常用的命令速查
  - 验证清单
  - 快速问题修复

### 🛠 功能文档

- **[页面加载动画](./add-page-loading-animate.md)**
  - 如何添加页面加载动画

- **[按需加载](./load-on-demand.md)**
  - 组件和路由的按需加载实现

- **[多标签页](./multi-tabs.md)**
  - 多标签页功能的使用说明

- **[打包分析](./webpack-bundle-analyzer.md)**
  - 如何分析和优化打包体积

## 🎯 快速开始

如果你是 AI 助手或新手开发者，建议按以下顺序阅读：

1. **先读** → [快速参考](./QUICK_REFERENCE.md) - 5 分钟掌握基本命令
2. **详读** → [本地开发指南](./LOCAL_DEVELOPMENT_GUIDE.md) - 深入了解开发流程
3. **按需** → 其他功能文档 - 根据需要查阅

## 🔍 快速查找

### 我想...

- **启动本地服务** → [快速参考 - 快速启动](./QUICK_REFERENCE.md#-快速启动)
- **验证代码修改** → [快速参考 - 验证清单](./QUICK_REFERENCE.md#-修改代码后的验证清单)
- **测试 API 接口** → [本地开发指南 - API 测试方法](./LOCAL_DEVELOPMENT_GUIDE.md#api-测试方法)
- **解决常见错误** → [本地开发指南 - 常见问题排查](./LOCAL_DEVELOPMENT_GUIDE.md#常见问题排查)
- **查看服务地址** → [快速参考 - 服务地址](./QUICK_REFERENCE.md#-服务地址)

## ⚠️ 重要提醒

### 给 AI 助手的建议

在修改代码时，请务必遵循以下原则：

1. **必须验证**：每次代码修改后都要进行验证
2. **清理缓存**：后端代码修改后必须清理缓存
3. **测试 API**：使用 curl 或浏览器测试修改的功能
4. **查看日志**：出现问题时查看日志文件
5. **遵循规范**：保持代码风格一致

详细的验证流程请参阅：[本地开发指南 - 验证工作流程](./LOCAL_DEVELOPMENT_GUIDE.md#验证工作流程)

### 黄金法则 ⚡️

```
修改代码 → 清理缓存 → 重启服务 → API测试 → 浏览器验证
```

## 📝 文档贡献

如果你发现文档有错误或需要补充，请：

1. 直接编辑对应的 Markdown 文件
2. 保持文档结构清晰
3. 添加实际的代码示例
4. 更新本 README 的索引

## 🔗 相关链接

### 项目仓库

- 主 API: `/Users/esone.qiu/Sites/caitou-api`
- 用户微服务: `/Users/esone.qiu/Sites/caitou-api-user`
- 配送微服务: `/Users/esone.qiu/Sites/caitou-api-delivery`
- 统计微服务: `/Users/esone.qiu/Sites/caitou-api-statistic`
- 管理后台: `/Users/esone.qiu/Sites/caitou-admin`
- 小程序客户端: `/Users/esone.qiu/Sites/caitou`

### 技术文档

- [Laravel 9.x 文档](https://laravel.com/docs/9.x)
- [Vue 2.x 文档](https://v2.vuejs.org/)
- [Ant Design Vue 文档](https://www.antdv.com/docs/vue/introduce-cn/)
- [Uni-app 文档](https://uniapp.dcloud.io/)

## 📞 获取帮助

如果遇到文档中没有涵盖的问题：

1. 查看项目的 `README.md` 文件
2. 搜索 `storage/logs/laravel.log` 日志
3. 使用 `php artisan tinker` 进行调试
4. 检查 `.env` 配置文件

---

**最后更新**：2025-11-23  
**维护团队**：开发团队

