<template>
  <setting-item-box name="数据联动层级"  alone>
    <n-input  v-model:value="optionData.level" />
    <n-text>(0表示不触发各级不同联动)</n-text>
  </setting-item-box>
  <collapse-item name="异步请求数据" :expanded="true">
    <n-button size="small" @click="add">添加异步请求</n-button>
    <div v-for="(item, index) in optionData.load" :key="index"> 
      <setting-item-box :name="'数据映射'+(index+1)"  >
        <SettingItem name="键值（对应数据的key）">
          <n-input  v-model:value="optionData.load[index].key" />
        </SettingItem>
        <SettingItem name="请求地址（GET请求）">
          <n-input  v-model:value="optionData.load[index].url" />
        </SettingItem >
        <!-- <SettingItem name="映射字段" alone>
          <n-input type="textarea" v-model:value="optionData.loadProps"></n-input>
        </SettingItem> -->
      </setting-item-box>
      <setting-item-box :name="'映射字段'+(index+1)" >
        <SettingItem name="label">
          <n-input  v-model:value="optionData.load[index].loadProps.label" />
        </SettingItem>
        <SettingItem name="value">
          <n-input  v-model:value="optionData.load[index].loadProps.value" />
        </SettingItem>
        <SettingItem name="children">
          <n-input  v-model:value="optionData.load[index].loadProps.children" />
        </SettingItem>
        <SettingItem name="isLeaf">
          <n-input  v-model:value="optionData.load[index].loadProps.isLeaf" />
        </SettingItem>
        <SettingItem>
          <n-space>
          <n-switch v-model:value="optionData.load[index].addAll" size="small" />
          <n-text>是否添加全部选项(value为空)</n-text>
        </n-space>
        </SettingItem>
        <n-button style="cursor: pointer;" @click="del(optionData.load[index].key)" class="del">
          <n-icon>
            <TrashIcon></TrashIcon>
          </n-icon>
            删除
        </n-button>
      </setting-item-box>
    </div>
  </collapse-item>
  <CollapseItem name="样式（确保数据中有treeLevel表示层级字段）">
    <n-button size="small" @click="addStyle">添加层级样式（层级为1则统一样式）</n-button>
    <template v-for="(item, index) in optionData.levelStyleArr" :key="index">
      <setting-item-box :name="'层级'+(index+1)">
        <setting-item name="颜色">
          <n-color-picker size="small" :modes="['hex']" v-model:value="item.fontColor"></n-color-picker>
        </setting-item>
        <setting-item name="字体大小">
          <n-input-number v-model:value="item.fontSize" size="small" placeholder="字体大小"></n-input-number>
        </setting-item>
        <n-button size="small" @click="delStyle(index)" v-if="optionData.levelStyleArr.length>1">删除层级{{index+1}}样式</n-button>
      </setting-item-box>
    </template>
  </CollapseItem>
</template>

<script lang="ts" setup>
import { PropType, watch } from 'vue'
import { CollapseItem, SettingItemBox,SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { icon } from '@/plugins'
const { TrashIcon } = icon.ionicons5
const add = ()=>{
  props.optionData.load.push({
    key:'',
    url:'',
    loadProps:{
      label:'label',
      value:'value',
      children:'children',
      isLeaf:'isLeaf'
    },
    addAll:false
  })
}



const del = (key:string)=>{
  props.optionData.load = props.optionData.load.filter(i=>i.key!==key)
}

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
console.log('data',props.optionData.dataset);

const addStyle = ()=>{
  props.optionData.levelStyleArr.push({
    fontColor:'#fff',
    fontSize:16
  })
}
const delStyle = (index:number)=>{
  props.optionData.levelStyleArr.splice(index,1)
}

</script>
<style lang="scss" scoped>
  .del{
    display: block;
    text-align: right;
    width: 100%;
    margin-top: 5px
  }
</style>
