<template>
  <n-collapse-item title="事件响应" name="1" >
    <template #header-extra>
      <label>点击事件</label>
    </template>
    <n-card
      class="n-card-shallow"
      size="small"
    >
    <setting-item-box name="触发的弹出框id" :alone="true">
      <n-input v-model:value="targetData.option.modalId" @change="inputChange"></n-input>  
    </setting-item-box>
    </n-card>
  </n-collapse-item>
</template>

<script lang="ts" setup>
import { VNodeChild, computed, ref } from 'vue'
import { SelectOption, SelectGroupOption } from 'naive-ui'
import { SettingItemBox, SettingItem, CollapseItem } from '@/components/Pages/ChartItemSetting'
import { CreateComponentType, CreateComponentGroupType, ChartFrameEnum } from '@/packages/index.d'
import { RequestParamsTypeEnum, RequestDataTypeEnum } from '@/enums/httpEnum'
import { InteractEventOn, COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { icon } from '@/plugins'
import noData from '@/assets/images/canvas/noData.png'
import { goDialog } from '@/utils'
import { useTargetData } from '../../../hooks/useTargetData.hook'

const { CloseIcon, AddIcon, HelpOutlineIcon } = icon.ionicons5
const { targetData, chartEditStore } = useTargetData()
const requestParamsTypeList = [RequestParamsTypeEnum.PARAMS, RequestParamsTypeEnum.HEADER]
const getId = ref()

const inputChange = (v:string)=>{
  targetData.value.option.modalId = v

}

// const inputChange = (v:string)=>{
//   targetData.value.events.advancedEvents = {...targetData.value.events.advancedEvents,
//     vnodeMounted:`
//       "e.el.addEventListener('click', () => {
//         components[${v}].ctx.chartConfig.option.isShow = !components[${v}].ctx.chartConfig.option.isShow
//       }, false)"
//     `
//   }
// }


</script>

<style lang="scss" scoped>
.mill-chart-target-data {
  :deep(pre) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.n-input-group {
  height: 30px;
}

.no-data {
  flex-direction: column;
  width: 100%;
  img {
    width: 120px;
  }
}

:deep(.n-base-selection .n-base-selection-label) {
  height: 32px;
}
</style>
