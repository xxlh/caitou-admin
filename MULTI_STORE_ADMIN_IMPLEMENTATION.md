# 仓储管理员多仓储支持实现方案

## 需求
允许一个仓储管理员管理多个仓储，而不是当前的一对一关系。

## 当前实现
- 前端：AssignForm.vue 使用单选下拉框选择一个仓储
- 后端：MemberController::assign_role() 只接受单个 store_id
- 数据库：model_has_roles 表中的 store_id 字段（通过 Spatie Permission）

## 实现方案

### 方案一：使用现有的 Spatie Permission 机制（推荐）
为每个仓储分配一次角色，类似区域管理员的实现方式。

#### 后端修改
文件：`caitou-api/app/Http/Controllers/Admin/MemberController.php`

```php
public function assign_role($id, Request $request)
{
    // ...existing code...
    
    } elseif ($request->role == '仓储管理员') {
        $this->validate($request, [
            'store_ids' => 'required|array',  // 改为数组
            'store_ids.*' => 'integer|exists:stores,id'
        ]);
        
        // 先移除该成员的所有仓储管理员角色
        $session_team_id = getPermissionsTeamId();
        
        // 为每个仓储分配角色
        foreach ($request->store_ids as $store_id) {
            setPermissionsTeamId($store_id);
            $member->assignRole($request->role);
        }
        
        setPermissionsTeamId($session_team_id);
    }
    
    // ...rest of code...
}
```

#### 前端修改
文件：`caitou-admin/src/views/manage/user/modules/AssignForm.vue`

将第26-33行的单选改为多选：

```vue
<a-form-item 
  label="选择对应仓储" 
  v-show="form.getFieldValue('role') == '仓储管理员'" 
  :labelCol="labelCol" 
  :wrapperCol="wrapperCol"
>
  <a-select
    mode="multiple"
    :options="storeList.map(store => ({label:store.name, value:store.id}))"
    :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
    placeholder="请选择一个或多个仓储"
    v-decorator="['store_ids', {
      rules: [{
        required: form.getFieldValue('role') == '仓储管理员', 
        message: '请至少选择一个仓储'
      }]
    }]"
  />
</a-form-item>
```

### 方案二：使用关联表（更灵活）
类似分销管理员的实现，创建一个专门的关联表。

#### 数据库迁移
```php
Schema::create('store_manager_assignments', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('member_id');
    $table->unsignedInteger('store_id');
    $table->unsignedInteger('assigned_by')->nullable();
    $table->timestamps();
    
    $table->unique(['member_id', 'store_id']);
    $table->foreign('member_id')->references('id')->on('members')->onDelete('cascade');
    $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
});
```

#### 模型
```php
class StoreManagerAssignment extends Model
{
    protected $fillable = ['member_id', 'store_id', 'assigned_by'];
    
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
```

#### 控制器方法
```php
public function assignStoresToManager($member_id, Request $request)
{
    $this->validate($request, [
        'store_ids' => 'required|array',
        'store_ids.*' => 'integer|exists:stores,id'
    ]);
    
    $member = Member::findOrFail($member_id);
    
    // 同步仓储分配
    DB::transaction(function () use ($member_id, $request) {
        StoreManagerAssignment::where('member_id', $member_id)->delete();
        
        foreach ($request->store_ids as $store_id) {
            StoreManagerAssignment::create([
                'member_id' => $member_id,
                'store_id' => $store_id,
                'assigned_by' => Auth::id()
            ]);
        }
    });
    
    return ['success' => true];
}
```

## 推荐方案
推荐使用**方案一**，原因：
1. 利用现有的 Spatie Permission 系统
2. 不需要额外的数据库表
3. 实现更简单，与区域管理员的逻辑一致
4. 权限检查可以直接使用 Spatie 的机制

## 实施步骤
1. 修改后端 MemberController::assign_role() 支持 store_ids 数组
2. 修改前端 AssignForm.vue 将 store_id 改为 store_ids，使用 mode="multiple"
3. 修改后端 MemberController::unassign_role() 支持批量移除
4. 测试多仓储分配功能
5. 测试权限检查是否正确工作

## 注意事项
- 需要确保在移除角色时，正确清理所有相关的仓储角色
- 需要在管理员列表页面正确显示多个仓储
- 需要考虑性能影响（如果仓储数量很多）

## 当前状态
- ❌ 后端未实现（需要修改 MemberController）
- ❌ 前端未实现（需要修改 AssignForm.vue）
- ⏳ 优先级：P2（可选优化）
- ⏳ 预计工作量：2小时（前端30分钟 + 后端1小时 + 测试30分钟）

## 相关文件
- 后端：`caitou-api/app/Http/Controllers/Admin/MemberController.php`
- 前端：`caitou-admin/src/views/manage/user/modules/AssignForm.vue`
- 前端：`caitou-admin/src/views/manage/user/Index.vue` (显示逻辑)

