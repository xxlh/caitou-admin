# 快速参考 - 本地开发常用命令

> 这是一个快速参考文档，包含最常用的命令和检查清单。详细文档请参阅 [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md)

## 🚀 环境说明

### 后端服务（已通过 XAMPP 运行）

后端服务已通过 XAMPP + Apache 自动运行，无需手动启动：

- ✅ http://api-dev.caitou.ieexx.com （主 API）
- ✅ http://user-api-dev.caitou.ieexx.com （用户微服务）
- ✅ http://delivery-api-dev.caitou.ieexx.com （配送微服务）
- ✅ http://statistic-api-dev.caitou.ieexx.com （统计微服务）

### 启动前端

```bash
# 管理后台前端
cd /Users/esone.qiu/Sites/caitou-admin && npm run serve
```

## ✅ 修改代码后的验证清单

### 后端代码修改

```bash
# 1️⃣ 清理缓存（必须！Apache 会自动重载代码，但缓存需要手动清理）
cd /Users/esone.qiu/Sites/caitou-api
php artisan config:clear && php artisan cache:clear && php artisan route:clear

# 2️⃣ 测试 API（代码已自动生效）
TOKEN="你的测试token"
curl -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/YOUR_ENDPOINT" \
  | python3 -m json.tool

# 3️⃣ 查看日志
tail -f storage/logs/laravel.log
```

> **重要**：使用 XAMPP/Apache，代码修改会立即生效，但缓存必须手动清理！

### 前端代码修改

```bash
# 1️⃣ 检查浏览器控制台
#    - Console 标签：查看 JavaScript 错误
#    - Network 标签：查看 API 请求

# 2️⃣ 清理浏览器缓存
#    Mac: Cmd + Shift + R
#    Windows: Ctrl + Shift + R

# 3️⃣ 测试功能
#    手动操作修改的功能，验证是否正常工作
```

### 数据库迁移

```bash
cd /Users/esone.qiu/Sites/caitou-api

# 运行迁移
php artisan migrate --force

# 检查迁移状态
php artisan migrate:status

# 验证表结构
php artisan tinker --execute="DB::select('DESCRIBE table_name');"
```

## 🔧 常用命令

### 获取测试 Token

```bash
cd /Users/esone.qiu/Sites/caitou-api
php artisan tinker --execute="
\$member = \App\Models\Member::first();
echo \$member->createToken('test')->plainTextToken . PHP_EOL;
"
```

### API 测试模板

```bash
TOKEN="your_token_here"

# 测试提现列表
curl -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/withdrawals?page=1&per_page=10" \
  | python3 -m json.tool

# 测试分销员列表
curl -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/agents?page=1&per_page=10" \
  | python3 -m json.tool

# 测试用户搜索
curl -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/users?keyword=test&per_page=10" \
  | python3 -m json.tool
```

### 清理所有缓存

```bash
# 使用清理脚本（推荐）
/Users/esone.qiu/Sites/clear-backend-cache.sh

# 或手动清理
cd /Users/esone.qiu/Sites/caitou-api
php artisan optimize:clear

cd /Users/esone.qiu/Sites/caitou-api-user
php artisan optimize:clear
```

## 🐛 常见问题快速修复

### 401 未登录错误

```bash
# 重新生成 Token
cd /Users/esone.qiu/Sites/caitou-api
php artisan tinker --execute="
echo App\Models\Member::first()->createToken('test')->plainTextToken;
"
```

### 404 路由找不到

```bash
cd /Users/esone.qiu/Sites/caitou-api

# 清理缓存
php artisan route:clear
php artisan config:clear

# 检查路由
php artisan route:list | grep "your-route"

# 检查 .htaccess 文件
ls -la public/.htaccess

# 如果路由存在但仍 404，可能是 Apache 配置问题
# 确认虚拟主机 DocumentRoot 指向 public 目录
```

### 400 参数错误

```bash
# 1. 开启 DEBUG 查看详细错误
sed -i '' 's/APP_DEBUG=false/APP_DEBUG=true/g' .env
php artisan config:clear

# 2. 重新测试 API

# 3. 关闭 DEBUG
sed -i '' 's/APP_DEBUG=true/APP_DEBUG=false/g' .env
php artisan config:clear
```

### 数据表不存在

```bash
cd /Users/esone.qiu/Sites/caitou-api-user
php artisan migrate --force
```

## 📍 服务地址

| 服务 | 地址 | 目录 |
|------|------|------|
| 主 API | http://api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api` |
| 用户 API | http://user-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-user` |
| 配送 API | http://delivery-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-delivery` |
| 统计 API | http://statistic-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-statistic` |
| 管理后台 | http://localhost:8080 | `/Users/esone.qiu/Sites/caitou-admin` |

## ⚡️ 黄金法则

```
修改代码 → 清理缓存 → 重启服务 → API测试 → 浏览器验证
```

**每个步骤都必须执行！**

---

更多详情请参阅：[完整开发指南](./LOCAL_DEVELOPMENT_GUIDE.md)

