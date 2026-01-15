# 管理员角色管理优化

## 修复的问题

### 1. 接口路径错误
**问题**：在"提升用户为分销员"弹窗中搜索用户时，接口路径多了一个 `/admin`，变成了 `http://api-dev.caitou.ieexx.com/admin/admin/users`

**原因**：axios 的 baseURL 已经包含了 `/admin` 前缀，但在代码中又写了 `/admin/users`

**修复**：
- 文件：`src/views/distribution/agents/Index.vue` (第567行)
- 改为：`axios.get('/users', ...)`

### 2. 分销管理员"可管理的分销员"下拉框为空
**问题**：在分配角色时选择"分销管理员"，穿梭框中没有可选的分销员

**原因**：
1. 只在编辑已有"分销管理员"角色的管理员时才会加载分销员列表
2. 首次分配"分销管理员"角色时不会自动加载列表

**修复**：
- 文件：`src/views/manage/user/modules/AssignForm.vue`
- 添加 `onValuesChange` 监听器，当选择"分销管理员"时自动加载分销员列表
- 加载时只获取一级分销员（`level: 1`）
- 改进了对话框关闭时的数据清理

## 新增功能

### 1. 支持仓储管理员多仓储分配

**前端改进** (`src/views/manage/user/modules/AssignForm.vue`):
- 仓储选择器已支持多选（`mode="multiple"`）
- 添加搜索和清空功能
- 在编辑时自动回填已分配的仓储列表
- 显示当前管理员已管理的所有仓储

**后端改进** (`app/Http/Controllers/Admin/MemberController.php`):
- `assign_role` 方法现在支持 `store_ids` 数组参数
- 兼容旧的单选 `store_id` 参数
- 分配新仓储时会先移除旧的仓储管理员角色
- `unassign_role` 方法同样支持批量移除

**API 参数**：
```javascript
// 分配单个仓储（兼容旧版）
{
  role: "仓储管理员",
  store_id: 1
}

// 分配多个仓储（新功能）
{
  role: "仓储管理员",
  store_ids: [1, 2, 3]
}
```

### 2. 管理员列表显示优化

**改进内容** (`src/views/manage/user/Index.vue` & 后端 API):
- 在角色列中显示仓储管理员管理的仓储名称
- 在角色列中显示分销管理员管理的分销员数量
- 修复了区域管理员显示时的字段错误（从 `store_id` 改为 `area_id`）
- 仓储管理员的多个仓储会分行显示

### 3. 编辑已分配管理员权限

**如何使用**：
1. 进入"管理员管理"页面（`/manage/user`）
2. 找到需要编辑的管理员
3. 点击"分配角色"按钮
4. 可以修改：
   - 角色类型
   - 仓储管理员的仓储列表（支持多选）
   - 区域管理员的区域
   - 分销管理员可管理的一级分销员

**数据回填**：
- 会自动显示当前管理员已有的角色
- 仓储管理员会显示所有已分配的仓储（多选状态）
- 区域管理员会显示已分配的区域
- 分销管理员会在穿梭框右侧显示已分配的分销员

## 数据库说明

不需要修改数据库结构，使用现有的 `model_has_roles` 表和 `distribution_manager_assignments` 表。

多仓储管理员是通过在 `model_has_roles` 表中为同一个管理员创建多条 `仓储管理员` 角色记录实现的，每条记录对应不同的 `store_id`（team_id）。

## 测试建议

1. **提升用户为分销员**：
   - 打开分销员管理页面
   - 点击"从用户提升为分销员"
   - 输入2个以上字符搜索用户
   - 验证接口路径正确（不包含重复的 `/admin`）

2. **分配分销管理员**：
   - 打开管理员管理页面
   - 点击任意管理员的"分配角色"
   - 选择"分销管理员"
   - 验证穿梭框显示一级分销员列表
   - 选择几个分销员并保存
   - 再次编辑该管理员，验证已选择的分销员正确显示在右侧

3. **分配多仓储管理员**：
   - 点击任意管理员的"分配角色"
   - 选择"仓储管理员"
   - 在仓储下拉框中选择多个仓储
   - 保存后在列表中验证显示多个仓储标签
   - 再次编辑，验证多个仓储正确回填

4. **管理员列表显示**：
   - 查看管理员列表
   - 验证仓储管理员显示仓储名称
   - 验证分销管理员显示"管理 X 个分销员"

## 相关文件

### 前端 (caitou-admin)
- `src/views/distribution/agents/Index.vue` - 分销员管理页面
- `src/views/manage/user/Index.vue` - 管理员列表页面
- `src/views/manage/user/modules/AssignForm.vue` - 分配角色对话框

### 后端 (caitou-api)
- `app/Http/Controllers/Admin/MemberController.php` - 管理员控制器
- `app/Models/DistributionManagerAssignment.php` - 分销管理员分配模型（已存在）

## 注意事项

1. 此修改**向后兼容**，旧的单仓储分配 API 仍然可以使用
2. 前端会同时发送 `store_ids` 数组，后端会优先使用 `store_ids`
3. 分销管理员的分销员分配是通过独立的 API (`/members/{id}/assign_agents`) 处理的
4. 多仓储管理员在权限系统中是通过多个 team_id 实现的，符合 Laravel Permission 的设计








