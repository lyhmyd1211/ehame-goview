<template>
  <div>
    <n-tree
      v-if="isLoad"
      :style="`width:${w}px;height:${height}px;overflow:auto`"
      block-line
      :data="option.value.dataset"
      :default-expanded-keys="option.value.defaultExpandedKeys"
      :on-load="handleLoad"
      :node-props="nodeProps"
      :render-label="renderLabel"
    />
    <n-tree
      v-else
      :style="`width:${w}px;height:${height}px;overflow:auto`"
      block-line
      :data="option.value.dataset"
      :default-expanded-keys="option.value.defaultExpandedKeys"
      :node-props="nodeProps"
      :render-label="renderLabel"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, ref, shallowReactive, watch, computed, toRaw, reactive, h } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartInteract } from '@/hooks'
import { InteractEventOn } from '@/enums/eventEnum'
import { ComponentInteractParamsEnum } from './interact'
import { useChartDataFetch } from '@/hooks'
import Charts from './charts.vue'
import { TreeOption } from 'naive-ui'
import { customizeHttp, get } from '@/api/http'
import { getTreeAtLevel } from '@/utils'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const { w, h:height } = toRefs(props.chartConfig.attr)
const option = shallowReactive({
  value: {
    dataset: props.chartConfig.option.dataset,
    load:props.chartConfig.option.load,
    defaultExpandedKeys:props.chartConfig.option.defaultExpandedKeys
  }
})

const isLoad = computed(()=>{
  return option.value.load.some((i:any)=>i.url)
})

const param = reactive<any>({})
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick () {
      if (props.chartConfig.interactActions&&props.chartConfig.interactActions.length>0) {
        props.chartConfig.interactActions[0].componentEmitEvents.data.map(item=>{
          if (option.belong ===item.value) {
            param[option.belong as string] = option.key
            
            }else if(option.key === item.value){
              param[option.key as string] = option.key
          }
        })
        useChartInteract(
          props.chartConfig,
          useChartEditStore,
          param,
          InteractEventOn.CHANGE
        )
      }
     
    },

  }
}

const fieldFilter = (tree:any[],filter:{label:string,value:string,children:string,isLeaf:string},extraData:any,level=1)=>{
  return tree.map(item=>{
    if (item[filter.children]) {
      return{
        label:item[filter.label],
        key:item[filter.value],
        children:fieldFilter(item[filter.children],filter,extraData,level++),
        isLeaf:item[filter.isLeaf],
        ...extraData,
        treeLevel:level+props.chartConfig.option.level
      }
    }else{
      return{
        label:item[filter.label],
        key:item[filter.value],
        isLeaf:true,
        ...extraData,
        treeLevel:level+props.chartConfig.option.level
      }
    }
   
  })
}

const  renderLabel= ({ option }: { option: TreeOption })=> {
  
  let color = props.chartConfig.option.levelStyleArr[0].fontColor
  let size = props.chartConfig.option.levelStyleArr[0].fontSize
  if (option.treeLevel&&option.treeLevel<props.chartConfig.option.levelStyleArr.length) {
    color = props.chartConfig.option.levelStyleArr[parseInt(option.treeLevel as string)-1].fontColor
    size = props.chartConfig.option.levelStyleArr[parseInt(option.treeLevel as string)-1].fontSize
  }else {
    if (option.treeLevel) {
      color = props.chartConfig.option.levelStyleArr[props.chartConfig.option.levelStyleArr.length-1].fontColor
      size = props.chartConfig.option.levelStyleArr[props.chartConfig.option.levelStyleArr.length-1].fontSize
    }else{
      color = props.chartConfig.option.levelStyleArr[0].fontColor
      size = props.chartConfig.option.levelStyleArr[0].fontSize
    }
  }
  return h(
      'span',
      { 
        style:`color:${color};font-size:${size}px`
      },
      option.label
    )
}


const chartEditStore = useChartEditStore()
const handleLoad = (node: TreeOption)=> {
  let load = option.value.load.filter((item:any)=>item.key===node.key)
  if (load&&load.length>0) {
    
      const fetchFn = async () => {
          const res = await customizeHttp(toRaw({requestUrl:load[0].url,requestDataType:('1' as any),requestHttpType:('get' as any),requestParamsBodyType:('none' as any),requestSQLContent:{sql:''},requestParams:({Body:{json:''}} as any),requestContentType:0,requestIntervalUnit:('second' as any)}), toRaw(chartEditStore.getRequestGlobalConfig))
          if (res) {
            try {
              const { data } = res
              node.children = []
              let filterData = fieldFilter(data,load[0].loadProps,{belong:node.key})
              if (load[0].addAll) {
                  node.children?.push({label:'全部',key:'',belong:node.key,treeLevel:node.treeLevel+1 })
                }
              filterData.map(item=>{
                  node.children?.push(item)
              })
            } catch (error) {
              console.error(error)
            }
          }
        }
        return fetchFn()

  }else{
    return new Promise<void>((resolve,reject)=>{
    
    reject()
  })
  }
  
}


const { vChartRef } = useChartDataFetch(props.chartConfig, useChartEditStore)

// 手动更新
watch(
  () => props.chartConfig.option,
  (newData: any) => {
    option.value = newData
    if (props.chartConfig.option.level!='0') {
      let tree = getTreeAtLevel(newData.dataset,parseInt(props.chartConfig.option.level))
      let arr:any = []
      tree&&tree.map((item,index)=>{
        arr.push({
          value:item.key,
          label:item.label
        })
      })
      if (props.chartConfig.interactActions) {
        props.chartConfig.interactActions[0].componentEmitEvents.data = arr
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped>
@include deep() {
  .n-base-selection-label {
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled):hover{
  background:rgb(243, 243, 245,0.1)
}
  .n-tree-node-content{
    
  }
</style>
