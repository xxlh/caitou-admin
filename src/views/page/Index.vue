<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="6">
          <a-button v-if="$auth('pages.create')" type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-col :span="12" :offset="6" style="display: flex; justify-content: flex-end; align-items: center; gap: 12px;">
          <a-select
            v-model="queryParam.area_id"
            placeholder="选择区域"
            style="width: 200px;"
            :loading="areasLoading"
            @change="onAreaChange"
          >
            <a-select-option v-for="area in areaOptions" :key="area.value" :value="area.value">
              {{ area.label }}
            </a-select-option>
          </a-select>
          <a-input-search
            class="input-search"
            v-model="queryParam.name"
            placeholder="请输入页面名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 页面类型 -->
      <template slot="type" slot-scope="text, item">
        <a-tag :color="text == PageTypeEnum.HOME.value ? 'green' : (text == PageTypeEnum.CATEGORY.value ? 'blue' : '')">{{ PageTypeEnum[text].name }}</a-tag>
        <a-tag v-if="item.is_default_area" color="orange">默认区域</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="item">
        <a v-if="$auth('pages.update')" @click="handleEdit(item)">编辑</a>
        <a
          v-action:setDefault
          v-if="item.type == PageTypeEnum.HOME.value && !item.is_default_area"
          @click="handleSetDefault(item)"
        >设为默认区域</a>
        <a
          v-action:delete
          v-if="item.type != PageTypeEnum.HOME.value"
          @click="handleDelete(item)"
        >删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/page'
import * as AreaApi from '@/api/area'
import { STable } from '@/components'
import { PageTypeEnum } from '@/common/enum/page'
import store from '@/store'

const columns = [
  {
    title: '页面ID',
    dataIndex: 'id'
  },
  {
    title: '页面名称',
    dataIndex: 'name'
  },
  {
    title: '页面类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '添加时间',
    dataIndex: 'created_at'
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at'
  },
  {
    title: '操作',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {
        name: '',
        area_id: store.getters.areaId,
      },
      // 区域选项
      areaOptions: [],
      areasLoading: false,
      // 枚举类
      PageTypeEnum,
      // 正在加载
      isLoading: false,
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response
          })
      }
    }
  },
  created () {
    // 加载有权限的区域列表
    this.loadAreas()
  },
  methods: {
    // 加载区域列表
    async loadAreas () {
      this.areasLoading = true
      try {
        const ownAreaIds = store.getters.ownAreaIds
        const isSuperAdmin = store.getters.role?.name === '超级管理员'
        // 获取所有区域列表
        const res = await AreaApi.list({ per_page: 100 })
        // 超级管理员可以看到所有区域，其他用户只能看到有权限的区域
        this.areaOptions = res.data
          .filter(area => isSuperAdmin || ownAreaIds.includes(area.id))
          .map(area => ({
            value: area.id,
            label: area.name || `${area.city || area.province}_${area.id}`
          }))
        // 如果当前选中的区域不在列表中，则选择第一个
        const validAreaIds = this.areaOptions.map(a => a.value)
        if (!validAreaIds.includes(this.queryParam.area_id) && this.areaOptions.length) {
          this.queryParam.area_id = this.areaOptions[0].value
        }
      } finally {
        this.areasLoading = false
      }
    },

    // 区域切换
    onAreaChange () {
      this.handleRefresh(true)
    },

    // 新增页面
    handleAdd () {
      this.$router.push({ path: './create', query: { areaId: this.queryParam.area_id } })
    },

    // 编辑页面
    handleEdit (item) {
      this.$router.push({ path: './update', query: { pageId: item.id } })
    },

    // 设置页面所属区域为默认区域
    handleSetDefault (item) {
      const app = this
      const areaName = item.area?.name || `区域ID: ${item.delivery_area_id}`
      const modal = this.$confirm({
        title: '确认设置为默认区域？',
        content: `设置后，「${areaName}」将成为默认区域。未选择区域的用户（如新用户、缓存过期用户、偏远地区用户）将展示该区域的首页、商品和分类。`,
        onOk () {
          return Api.setDefault(item.id)
            .then((result) => {
              app.$message.success('设置成功', 1.5)
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted(item.id)
            .then((result) => {
              app.$message.success('已删除', 1.5)
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    /**
     * 检索查询
     */
    onSearch () {
      this.handleRefresh(true)
    }

  }
}
</script>
<style lang="less">
.input-search {
  max-width: 300px;
  min-width: 150px;
  float: right;
}
</style>
