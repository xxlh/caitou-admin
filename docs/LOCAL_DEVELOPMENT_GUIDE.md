# 本地开发与验证指南

> **重要**：本文档专为 AI 助手设计，用于指导如何在本地环境启动服务、验证修改和确保代码正确性。

## 目录

- [项目架构](#项目架构)
- [本地服务启动](#本地服务启动)
- [验证工作流程](#验证工作流程)
- [API 测试方法](#api-测试方法)
- [常见问题排查](#常见问题排查)
- [最佳实践](#最佳实践)

---

## 项目架构

本项目采用微服务架构，包含以下服务：

| 服务名称 | 本地域名 | 目录 | 说明 |
|---------|---------|------|------|
| 主 API | http://api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api` | 主业务 API |
| 用户微服务 | http://user-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-user` | 用户管理 |
| 配送微服务 | http://delivery-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-delivery` | 配送管理 |
| 统计微服务 | http://statistic-api-dev.caitou.ieexx.com | `/Users/esone.qiu/Sites/caitou-api-statistic` | 数据统计 |
| 管理后台 | - | `/Users/esone.qiu/Sites/caitou-admin` | Vue.js 前端 |
| 小程序客户端 | - | `/Users/esone.qiu/Sites/caitou` | Uni-app 客户端 |

### 服务依赖关系

```
caitou-admin (前端)
    ↓
api-dev.caitou.ieexx.com (主 API)
    ↓ ↓ ↓ ↓
    ├─→ user-api-dev (用户服务)
    ├─→ delivery-api-dev (配送服务)
    └─→ statistic-api-dev (统计服务)
```

---

## 本地服务启动

### 前置条件检查

```bash
# 检查 PHP 版本 (需要 >= 8.0)
php -v

# 检查 Node.js 版本 (需要 >= 14)
node -v

# 检查 MySQL 是否运行
mysql --version
```

### 1. 后端 API 服务（已通过 XAMPP 运行）

> **重要**：本项目使用 XAMPP + Apache，后端服务已经自动运行，无需手动启动。

#### 检查后端服务状态

后端服务通过 XAMPP 的 Apache 自动运行，域名映射已配置：

```bash
# 检查 XAMPP 服务是否运行
# 方式1: 打开 XAMPP 控制面板查看 Apache 和 MySQL 状态

# 方式2: 测试服务连接
curl http://api-dev.caitou.ieexx.com/
curl http://user-api-dev.caitou.ieexx.com/
curl http://delivery-api-dev.caitou.ieexx.com/
curl http://statistic-api-dev.caitou.ieexx.com/
```

#### 修改后端代码后的操作

**每次修改后端代码后，只需清理缓存：**

```bash
# 清理主 API 缓存
cd /Users/esone.qiu/Sites/caitou-api
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 清理用户微服务缓存
cd /Users/esone.qiu/Sites/caitou-api-user
php artisan config:clear
php artisan cache:clear

# 清理其他微服务缓存（如果修改了相关代码）
cd /Users/esone.qiu/Sites/caitou-api-delivery
php artisan config:clear && php artisan cache:clear

cd /Users/esone.qiu/Sites/caitou-api-statistic
php artisan config:clear && php artisan cache:clear
```

> **注意**：由于使用 Apache，代码修改后会自动生效，但 Laravel 的配置、路由等缓存需要手动清理。

#### 运行数据库迁移

如果添加或修改了数据表：

```bash
cd /Users/esone.qiu/Sites/caitou-api
php artisan migrate --force

cd /Users/esone.qiu/Sites/caitou-api-user
php artisan migrate --force
```

#### 重启 Apache（如果需要）

通常不需要重启，但如果遇到问题：

```bash
# 通过 XAMPP 控制面板重启 Apache
# 或使用命令行（根据你的 XAMPP 安装路径）:
# sudo /Applications/XAMPP/xamppfiles/bin/apachectl restart
```

### 2. 启动前端管理后台

```bash
cd /Users/esone.qiu/Sites/caitou-admin

# 安装依赖（首次或 package.json 更新后）
npm install

# 启动开发服务器
npm run serve

# 访问地址通常是 http://localhost:8080
```

### 3. 验证服务状态

```bash
# 测试主 API
curl http://api-dev.caitou.ieexx.com/

# 测试用户微服务
curl -H "MicroService-Secret: caitouusersecret" \
  http://user-api-dev.caitou.ieexx.com/super/users

# 如果返回 JSON 数据或 401 认证错误，说明服务正常运行

# 检查 XAMPP 服务状态
# 打开 XAMPP 控制面板，确保 Apache 和 MySQL 都在运行
```

---

## 验证工作流程

### ⚠️ 重要原则

**每次修改代码后，必须进行验证！**

1. **后端代码修改后** → 清理缓存 → 重启服务 → API 测试
2. **前端代码修改后** → 检查控制台错误 → 浏览器测试
3. **配置文件修改后** → 清理缓存 → 重启服务 → 验证配置
4. **数据库修改后** → 运行迁移 → 验证数据结构

### 验证检查清单

#### ✅ 后端代码修改验证

**重要**：由于使用 Apache + mod_php，代码修改会**立即生效**，但 Laravel 缓存需要清理！

```bash
# 1. 清理缓存（必须！）
cd /Users/esone.qiu/Sites/caitou-api  # 或其他后端项目目录
php artisan config:clear
php artisan cache:clear
php artisan route:clear
# 注意：不需要重启 Apache！

# 2. 检查路由
php artisan route:list | grep "你修改的路由"

# 3. 使用 curl 测试 API
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  "http://api-dev.caitou.ieexx.com/admin/YOUR_ENDPOINT"

# 4. 查看日志（实时监控）
tail -f storage/logs/laravel.log

# 5. 如果还是看到旧的行为，可能是 OPcache 问题
# 访问 phpinfo 查看 OPcache 是否启用
# 或者重启 Apache：通过 XAMPP 控制面板重启
```

#### ✅ 前端代码修改验证

```bash
# 1. 检查编译错误
# 开发服务器会自动显示编译错误

# 2. 浏览器检查
# - 打开浏览器开发者工具 (F12)
# - 查看 Console 是否有错误
# - 查看 Network 标签检查 API 请求

# 3. 清理浏览器缓存
# Cmd + Shift + R (Mac) 或 Ctrl + Shift + R (Windows)
```

#### ✅ 数据库迁移验证

```bash
cd /Users/esone.qiu/Sites/caitou-api

# 1. 检查迁移状态
php artisan migrate:status

# 2. 运行迁移
php artisan migrate --force

# 3. 验证表结构
php artisan tinker
# 在 tinker 中执行：
# DB::select('SHOW TABLES');
# DB::select('DESCRIBE table_name');
```

---

## API 测试方法

### 获取测试 Token

```bash
cd /Users/esone.qiu/Sites/caitou-api

php artisan tinker --execute="
\$member = \App\Models\Member::first();
if (\$member) {
    \$token = \$member->createToken('test-token')->plainTextToken;
    echo 'Token: ' . \$token . PHP_EOL;
} else {
    echo 'No members found' . PHP_EOL;
}
"
```

### 常用 API 测试命令

#### 1. 测试提现列表

```bash
TOKEN="YOUR_TOKEN_HERE"

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/withdrawals?page=1&per_page=10" \
  | python3 -m json.tool
```

#### 2. 测试分销员列表

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/agents?page=1&per_page=10" \
  | python3 -m json.tool
```

#### 3. 测试用户搜索

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/users?keyword=test&per_page=10" \
  | python3 -m json.tool
```

#### 4. 测试微服务连接

```bash
# 直接测试用户微服务
curl -s -H "MicroService-Secret: caitouusersecret" \
  "http://user-api-dev.caitou.ieexx.com/super/users?page=1&per_page=5" \
  | python3 -m json.tool
```

### 使用 Postman/Insomnia

推荐使用 API 测试工具以便：
- 保存常用请求
- 管理环境变量
- 查看响应详情
- 生成代码片段

---

## 常见问题排查

### 问题 1: API 返回 401 未登录

**原因**：Token 失效或未传递

**解决**：
```bash
# 重新生成 Token
cd /Users/esone.qiu/Sites/caitou-api
php artisan tinker --execute="
\$member = \App\Models\Member::first();
echo \$member->createToken('test')->plainTextToken;
"

# 确保请求头正确
curl -H "Authorization: Bearer NEW_TOKEN" ...
```

### 问题 2: 路由找不到 (404)

**原因**：路由缓存或 Apache 虚拟主机配置问题

**解决**：
```bash
cd /Users/esone.qiu/Sites/caitou-api

# 1. 清理所有缓存
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 2. 查看所有路由
php artisan route:list | grep "你的路由"

# 3. 检查 .htaccess 文件是否存在
ls -la public/.htaccess

# 4. 如果问题依然存在，通过 XAMPP 控制面板重启 Apache
```

### 问题 3: 参数错误 (400)

**原因**：可能是数据表不存在或参数验证失败

**解决**：
```bash
# 1. 开启 DEBUG 模式查看详细错误
cd /Users/esone.qiu/Sites/caitou-api-user
sed -i '' 's/APP_DEBUG=false/APP_DEBUG=true/g' .env
php artisan config:clear

# 2. 重新测试 API，查看详细错误信息

# 3. 检查数据表是否存在
php artisan tinker --execute="
DB::select('SHOW TABLES');
"

# 4. 运行迁移
php artisan migrate --force

# 5. 关闭 DEBUG 模式
sed -i '' 's/APP_DEBUG=true/APP_DEBUG=false/g' .env
php artisan config:clear
```

### 问题 4: 微服务连接失败

**原因**：端点配置错误或服务未启动

**解决**：
```bash
# 1. 检查配置
cd /Users/esone.qiu/Sites/caitou-api
cat .env | grep "USERSERVICE_ENDPOINT"

# 应该是：
# USERSERVICE_ENDPOINT=http://user-api-dev.caitou.ieexx.com/

# 2. 检查微服务是否运行
curl http://user-api-dev.caitou.ieexx.com/

# 3. 检查 Secret 是否匹配
# 主 API 的 USERSERVICE_SECRET 应该等于
# User API 的 MICROSERVICE_SECRET
```

### 问题 5: 前端无法连接后端

**原因**：代理配置或 CORS 问题

**解决**：
```bash
# 1. 检查前端配置
cd /Users/esone.qiu/Sites/caitou-admin
cat .env.development | grep VUE_APP_API_BASE_URL

# 2. 检查后端 CORS 配置
cd /Users/esone.qiu/Sites/caitou-api
cat config/cors.php

# 3. 清理前端缓存并重启
cd /Users/esone.qiu/Sites/caitou-admin
rm -rf node_modules/.cache
npm run serve
```

---

## 最佳实践

### 1. 修改代码前

- ✅ 理解现有代码的作用
- ✅ 检查是否有相关测试
- ✅ 备份或使用 Git 分支

### 2. 修改代码时

- ✅ 遵循项目的编码规范
- ✅ 保持代码一致性
- ✅ 添加必要的注释
- ✅ 处理异常情况

### 3. 修改代码后（必须执行）

```bash
# 后端修改后的标准流程（使用 XAMPP/Apache）
cd /Users/esone.qiu/Sites/caitou-api

# 1. 清理缓存（必须执行！）
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 2. 验证路由
php artisan route:list | grep "YOUR_ROUTE"

# 3. 测试 API（代码会自动生效）
curl -H "Authorization: Bearer TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/YOUR_ENDPOINT" \
  | python3 -m json.tool

# 4. 查看日志
tail -f storage/logs/laravel.log

# 注意：使用 Apache 时代码修改会立即生效，无需重启服务
```

```bash
# 前端修改后的标准流程
cd /Users/esone.qiu/Sites/caitou-admin

# 1. 检查编译错误（开发服务器自动显示）

# 2. 浏览器测试
# - 打开开发者工具 (F12)
# - 检查 Console 错误
# - 检查 Network 请求

# 3. 测试功能
# - 手动操作测试修改的功能
# - 验证各种边界情况
```

### 4. 提交代码前

- ✅ 运行所有相关测试
- ✅ 检查是否有遗留的调试代码
- ✅ 确保所有修改都已验证
- ✅ 编写清晰的提交信息

---

## 快速参考命令

### 一键清理所有后端缓存

创建脚本 `/Users/esone.qiu/Sites/clear-backend-cache.sh`:

```bash
#!/bin/bash

echo "清理所有后端服务缓存..."

# 清理主 API
cd /Users/esone.qiu/Sites/caitou-api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
echo "✅ 主 API 缓存已清理"

# 清理用户微服务
cd /Users/esone.qiu/Sites/caitou-api-user
php artisan config:clear
php artisan cache:clear
echo "✅ 用户微服务缓存已清理"

# 清理配送微服务
cd /Users/esone.qiu/Sites/caitou-api-delivery
php artisan config:clear
php artisan cache:clear
echo "✅ 配送微服务缓存已清理"

# 清理统计微服务
cd /Users/esone.qiu/Sites/caitou-api-statistic
php artisan config:clear
php artisan cache:clear
echo "✅ 统计微服务缓存已清理"

echo "所有缓存清理完成！"
```

使用方法：
```bash
chmod +x /Users/esone.qiu/Sites/clear-backend-cache.sh
/Users/esone.qiu/Sites/clear-backend-cache.sh
```

### 一键清理缓存（推荐使用脚本）

```bash
# 方式1: 使用清理脚本（推荐）
/Users/esone.qiu/Sites/clear-backend-cache.sh

# 方式2: 手动清理
for dir in caitou-api caitou-api-user caitou-api-delivery caitou-api-statistic; do
  if [ -d "/Users/esone.qiu/Sites/$dir" ]; then
    cd "/Users/esone.qiu/Sites/$dir"
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    echo "✅ Cleared cache for $dir"
  fi
done
```

### 快速 API 测试模板

```bash
# 保存为 test-api.sh
TOKEN="YOUR_TOKEN"
BASE_URL="http://api-dev.caitou.ieexx.com"

# 测试函数
test_api() {
  echo "Testing: $1"
  curl -s -w "\nHTTP Code: %{http_code}\n" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "$BASE_URL$2" | python3 -m json.tool
  echo "---"
}

# 执行测试
test_api "Withdrawals" "/admin/withdrawals?page=1&per_page=10"
test_api "Agents" "/admin/agents?page=1&per_page=10"
test_api "Users" "/admin/users?keyword=test&per_page=10"
```

---

## 环境配置参考

### 主 API 关键配置 (.env)

```env
APP_ENV=local
APP_DEBUG=false  # 生产环境必须为 false
APP_URL=http://api-dev.caitou.ieexx.com

# 数据库
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=caitou
DB_USERNAME=root
DB_PASSWORD=your_password

# 微服务配置
USERSERVICE_ENDPOINT=http://user-api-dev.caitou.ieexx.com/
USERSERVICE_SECRET=caitouusersecret
DELIVERYSERVICE_ENDPOINT=http://delivery-api-dev.caitou.ieexx.com/
STATISTICSERVICE_ENDPOINT=http://statistic-api-dev.caitou.ieexx.com/
MICROSERVICE_SECRET=caitousecret
```

### 用户微服务关键配置 (.env)

```env
APP_ENV=local
APP_DEBUG=false
APP_URL=http://user-api-dev.caitou.ieexx.com

# 数据库
DB_DATABASE=caitou  # 与主 API 共享数据库

# 微服务认证
MICROSERVICE_SECRET=caitouusersecret
```

---

## 附录

### A. 完整的验证流程示例

假设你修改了 `DistributionsController.php` 的 `getAgents` 方法：

```bash
# 步骤 1: 清理缓存
cd /Users/esone.qiu/Sites/caitou-api
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 步骤 2: 检查路由
php artisan route:list | grep agents

# 步骤 3: 获取测试 Token
php artisan tinker --execute="
\$member = \App\Models\Member::first();
echo \$member->createToken('test')->plainTextToken;
"

# 步骤 4: 测试 API
TOKEN="刚生成的token"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/agents?page=1&per_page=10" \
  | python3 -m json.tool

# 步骤 5: 检查响应
# - HTTP 状态码应该是 200
# - 返回数据结构正确
# - 数据内容符合预期

# 步骤 6: 测试边界情况
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/agents?page=1&per_page=0"  # 无效参数
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://api-dev.caitou.ieexx.com/admin/agents?page=9999"  # 超大页码

# 步骤 7: 前端测试
cd /Users/esone.qiu/Sites/caitou-admin
# 打开浏览器，访问分销员列表页面
# 检查数据是否正常显示
```

### B. 调试技巧

#### 使用 Laravel Tinker

```bash
cd /Users/esone.qiu/Sites/caitou-api
php artisan tinker

# 测试数据库查询
>>> App\Models\DistributionAgent::count();
=> 10

# 测试模型关系
>>> $agent = App\Models\DistributionAgent::first();
>>> $agent->managerScopes;

# 测试微服务调用
>>> App\Services\MicroService::User()->get('users');
```

#### 查看 SQL 查询

```bash
# 在代码中临时添加：
DB::enableQueryLog();
// 你的代码
dd(DB::getQueryLog());
```

#### 实时查看日志

```bash
# 主 API
tail -f /Users/esone.qiu/Sites/caitou-api/storage/logs/laravel.log

# 用户微服务
tail -f /Users/esone.qiu/Sites/caitou-api-user/storage/logs/laravel.log

# 过滤错误
tail -f storage/logs/laravel.log | grep -i error
```

---

## 总结

记住这个黄金法则：

> **修改代码 → 清理缓存 → 重启服务 → API测试 → 浏览器验证**

每个步骤都不能跳过！这样可以确保：
- 代码修改立即生效
- 及时发现问题
- 避免浪费时间排查缓存问题
- 保证代码质量

---

**最后更新时间**：2025-11-23  
**维护人员**：开发团队  
**适用版本**：Laravel 9.x / Vue 2.x

