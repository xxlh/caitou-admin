<template>
  <div class="audio-list clearfix" :class="{ multiple }">
    <draggable
      v-if="selectedItems.length"
      v-model="selectedItems"
      @start="drag=true"
      @end="drag=false"
      @update="onUpdate"
    >
      <transition-group type="transition" :name="'flip-list'">
        <div
          v-for="(item, index) in selectedItems"
          :key="item.id"
          class="file-item"
          :style="{ width: `${width}px`, height: `${width}px` }"
        >
          <a :href="item.external_url" target="_blank">
            <div class="img-cover" :style="{ backgroundImage: `url('${item.preview_url||item.original_url}')` }"></div>
          </a>
          <a-icon
            class="icon-close"
            theme="filled"
            type="close-circle"
            @click="handleDeleteFileItem(index)"
          />
        </div>
      </transition-group>
    </draggable>
    <div
      v-show="(!multiple && selectedItems.length <= 0) || (multiple && selectedItems.length < maxNum)"
      class="selector"
      :style="{width: `${width}px`, height: `${width}px` }"
      title="点击选择音频"
      @click="handleSelectAudio"
    >
      <a-icon class="icon-plus" :style="{ fontSize: `${width * 0.4}px` }" type="plus" />
    </div>
    <FilesModal
      ref="FilesModal"
      :channel="channel"
      :channel_id="channel_id"
      :collection="collection"
      :multiple="multiple"
      :maxNum="maxNum"
      :selectedNum="selectedItems.length"
      :fileType="FileTypeEnum.AUDIO.value"
      @handleSubmit="handleSelectAudioSubmit"
    />
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import draggable from 'vuedraggable'
import cloneDeep from 'lodash.clonedeep'
import { FilesModal } from '@/components/Modal'
import FileTypeEnum from '@/common/enum/file/FileType'

export default {
  name: 'SelectAudio',
  components: {
    FilesModal,
    draggable
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    multiple: PropTypes.bool.def(false),
    maxNum: PropTypes.integer.def(100),
    defaultList: PropTypes.array.def([]),
    width: PropTypes.integer.def(80),
    channel: PropTypes.string.def(''),
    channel_id: PropTypes.integer.def(0),
    collection: PropTypes.string.def(''),
  },
  data () {
    return {
      FileTypeEnum,
      selectedItems: [],
      allowProps: true
    }
  },
  watch: {
    defaultList: {
      immediate: true,
      handler (val) {
        const { selectedItems, allowProps } = this
        if (val.length && !selectedItems.length && allowProps) {
          this.selectedItems = cloneDeep(val)
          this.onChange()
        }
      }
    }
  },
  methods: {
    onUpdate () {
      this.onChange()
    },

    handleSelectAudio () {
      this.$refs.FilesModal.show()
    },

    handleSelectAudioSubmit (result) {
      if (result.length > 0) {
        const { multiple, selectedItems } = this
        this.selectedItems = multiple ? selectedItems.concat(result) : result
        this.onChange()
      }
    },

    handleDeleteFileItem (index) {
      this.selectedItems.splice(index, 1)
      if (this.selectedItems.length === 0) {
        this.allowProps = false
      }
      this.onChange()
    },

    onChange () {
      const { multiple, selectedItems } = this
      if (selectedItems.length <= 0) {
        return this.$emit('change', multiple ? [] : 0)
      }
      const fileId = multiple ? selectedItems.map(item => item.id) : selectedItems[0].id
      return this.$emit('change', fileId, selectedItems)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.flip-list-move {
  transition: transform 0.3s !important;
}
/deep/.no-move {
  transition: transform 0s;
}

.audio-list {
  margin-bottom: 6px;
  &.multiple {
    .file-item,
    .selector {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

.file-item {
  position: relative;
  float: left;
  width: 80px;
  height: 80px;
  position: relative;
  padding: 2px;
  border: 1px solid #ddd;
  background: #fff;
  .img-cover {
    display: block;
    margin: 0 auto;
    width: 45px;
    height: 100%;
    background: no-repeat center center / 100%;
  }
  &:hover {
    .icon-close {
      display: block;
    }
  }
  .icon-close {
    display: none;
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
    font-size: 16px;
    color: #c5c5c5;
    &:hover {
      color: #7d7d7d;
    }
  }
  &:hover {
    border: 1px solid #a7c3de;
  }
}

.selector {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  cursor: pointer;
}

.icon-plus {
  color: #999;
}
</style>
