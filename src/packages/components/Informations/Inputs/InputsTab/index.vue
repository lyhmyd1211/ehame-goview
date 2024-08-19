<template>
  <n-tabs :type="option.value.tabType" @update:value="onChange" :default-value="option.value.tabLabel" :style="tabStyle" >
    <template v-if="option.value.paneId?.length>0">
      <n-tab-pane v-for="(item, index) in option.value.dataset" :name="item.label" :key="index" :value="item.value" style="padding-top: 0"> 
      <div :id="'tabPane-'+chartConfig.id+'-'+index" style="position: relative;"></div>
      </n-tab-pane>
    </template>
    <template v-else>
      <n-tab v-for="(item, index) in option.value.dataset" :name="item.label" :key="index"> {{ item.label }} </n-tab>
    </template>
  </n-tabs>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, computed, nextTick } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartInteract } from '@/hooks'
import { InteractEventOn } from '@/enums/eventEnum'
import { ComponentInteractParamsEnum } from './interact'
import { getUUID } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const {
  fontColor,
  activeColor
} = toRefs(props.chartConfig.option)

const chartEditStore = useChartEditStore()

const { w, h } = toRefs(props.chartConfig.attr)
const option = shallowReactive({
  value: cloneDeep(props.chartConfig.option)
})

// 监听事件改变
const onChange = (v: string) => {
  if (v === undefined) return
  const selectItem = option.value.dataset.find((item: { label: string; value: any }) => item.label === v)
  // 存储到联动数据
  useChartInteract(
    props.chartConfig,
    useChartEditStore,
    { [ComponentInteractParamsEnum.DATA]: selectItem.value },
    InteractEventOn.CHANGE
  )
  moveDom()
}

const tabStyle = computed(()=>{
  return {
  "--n-tab-text-color":fontColor?.value,
  "--n-tab-text-color-active":activeColor?.value,
  "--n-bar-color":activeColor?.value,
  "--n-tab-text-color-hover":activeColor?.value,
  }
})
 

const moveDom = ()=>{
  nextTick(()=>{
    option.value.paneId?.map((item:string,index:number)=>{
        let node = chartEditStore.getComponentList.filter(i=>i.id===item)
        if (node[0]) {
          let hideNode = document.getElementById(node[0].id)
          let curId = getUUID()
          node&&node.length>0&&chartEditStore.addShadowList({...node[0],id:curId})
          nextTick(()=>{
            let temp = document.getElementById(curId)
            if (temp) {
              let content = document.getElementById('tabPane-'+props.chartConfig.id+'-'+index)
              content?.appendChild(temp)
              if (hideNode) {
                // 使用方法
                hideNode.style.display  = 'none'
              }
              // parent?.removeChild(temp);
            }
          })
        }
       
        
      })
    })
}

// 手动更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option.value = newData
    onChange(newData.tabValue)
    moveDom()
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<style lang="scss" scoped>

</style>