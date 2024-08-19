<template>
  <collapse-item name="基础" :expanded="true">
    <setting-item-box name="是否离线地图" alone>
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.isOffLine" size="small" />
          <n-text>是否离线地图</n-text>
        </n-space>
      </setting-item>
    </setting-item-box>
    <SettingItemBox name="接口地址前缀" alone v-if="optionData.mapOptions.isOffLine">
      <setting-item  >
        <n-input v-model:value="optionData.mapOptions.offLineApi" size="small"></n-input>
      </setting-item>
    </SettingItemBox>
    <SettingItemBox name="离线地图滤镜" alone v-if="optionData.mapOptions.isOffLine">
      <setting-item  >
        <n-input v-model:value="optionData.mapOptions.filter" size="small"></n-input>
      </setting-item>
    </SettingItemBox>
    <setting-item-box name="语言类型" :alone="true" v-if="!optionData.mapOptions.isOffLine">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.lang" :options="langOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="Key" :alone="true" v-if="!optionData.mapOptions.isOffLine">
      <setting-item name="请务必使用自己的高德应用 key">
        <n-input v-model:value="optionData.mapOptions.amapKey" size="small"></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="自定义地图样式ID" :alone="true" v-if="!optionData.mapOptions.isOffLine">
      <setting-item>
        <n-input size="small" v-model:value="optionData.mapOptions.amapStyleKeyCustom" />
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="地图" :expanded="true">
    <setting-item-box name="主题" v-if="!optionData.mapOptions.isOffLine">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.amapStyleKey" :options="themeOptions" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="显示要素" :alone="true" v-if="!optionData.mapOptions.isOffLine">
      <n-checkbox-group v-model:value="optionData.mapOptions.features">
        <n-space item-style="display: flex;">
          <n-checkbox :value="item.value" :label="item.label" v-for="(item, index) in featuresOptions" :key="index" />
        </n-space>
      </n-checkbox-group>
    </setting-item-box>
    <setting-item-box name="文字标注" :alone="true" v-if="!optionData.mapOptions.isOffLine">
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.showLabel" size="small" />
          <n-text>是否显示</n-text>
        </n-space>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="位置">
      <SettingItem name="默认贵州">
        <n-select
          size="small"
          v-model:value="mapRegion.centerPos"
          :options="mapRegionOptions"
          value-field="centerPos"
          label-field="name"
          @update:value="areaChange"
        />
      </SettingItem>
      <!-- <setting-item name="经度">
        <n-input-number v-model:value="optionData.mapOptions.amapLon" :show-button="false" size="small">
          <template #suffix>°</template>
        </n-input-number>
      </setting-item>
      <setting-item name="纬度">
        <n-input-number v-model:value="optionData.mapOptions.amapLat" :show-button="false" size="small">
          <template #suffix>°</template>
        </n-input-number>
      </setting-item> -->
      <setting-item name="初始缩放">
        <n-input-number v-model:value="optionData.mapOptions.amapZindex" :min="0" size="small" ></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="模式" :alone="true">
      <setting-item>
        <n-radio-group v-model:value="optionData.mapOptions.viewMode" name="radiogroup">
          <n-space>
            <n-radio v-for="song in viewModeOptions" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </setting-item>
    </setting-item-box>
    <template v-if="optionData.mapOptions.viewMode === '3D'">
      <setting-item-box>
        <setting-item name="天空色">
          <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.mapOptions.skyColor"></n-color-picker>
        </setting-item>
        <setting-item name="俯仰角">
          <n-input-number v-model:value="optionData.mapOptions.pitch" :min="0" :max="83" size="small"></n-input-number>
        </setting-item>
      </setting-item-box>
    </template>
    <setting-item-box name="地图缩放等级">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.mapLevel" :options="levelOptions" @change="levelChange"/>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="标记" :expanded="true">
    <setting-item-box name="hover">
      <setting-item name='遮罩hover颜色'>
        <n-color-picker size="small"  v-model:value="optionData.mapOptions.hoverColor" :modes="['hex']"></n-color-picker>
      </setting-item>
      <setting-item name="遮罩hover透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.hoverOpacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
        </setting-item>
    </setting-item-box>
    <setting-item-box name="省地图">
      <setting-item name="类型">
        <n-select size="small" v-model:value="optionData.mapOptions.mapMarkerType" :options="MarkerOptions" />
      </setting-item>
      <setting-item name="组件ID" v-if="optionData.mapOptions.mapMarkerType===MarkerEnum.COMPONENT">
        <n-input v-model:value="optionData.mapOptions.marker.id" size="small" ></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="省界掩模" :alone="true">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.showMask" :options="MaskOptions" />
        <!-- <n-space>
          <n-switch v-model:value="optionData.mapOptions.showMask" size="small" />
          <n-text>是否显示</n-text>
        </n-space> -->
      </setting-item>
    </setting-item-box>
    <setting-item-box name="省界遮罩" >
      <setting-item name='是否显示'>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.showPolygon" size="small" :disabled="optionData.mapOptions.mapLevel!=='1'"/>
        </n-space>
      </setting-item>
      <template v-if="optionData.mapOptions.showPolygon">
        <setting-item name="是否显示遮罩名称">
          <n-space>
            <n-switch v-model:value="optionData.mapOptions.showPolygonName" size="small" />
          </n-space>
        </setting-item>
          <setting-item name='遮罩填充颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor.fillColor"></n-color-picker>
        </setting-item>
        <setting-item name='遮罩描边颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor.strokeColor"></n-color-picker>
        </setting-item>
        <setting-item name="遮罩透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.polygonColor.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
        </setting-item>
      </template>
    </setting-item-box>
    <setting-item-box name="市地图" v-if="optionData.mapOptions.mapLevel!=='1'">
      <setting-item name="类型">
        <n-select size="small" v-model:value="optionData.mapOptions.mapMarkerType_city" :options="MarkerOptions" />
      </setting-item>
      <setting-item name="组件ID" v-if="optionData.mapOptions.mapMarkerType_city===MarkerEnum.COMPONENT">
        <n-input v-model:value="optionData.mapOptions.marker.id_city" size="small" ></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="市界掩模" :alone="true" v-if="optionData.mapOptions.mapLevel!=='1'">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.showMask_city" :options="MaskOptions" />
        <!-- <n-space>
          <n-switch v-model:value="optionData.mapOptions.showMask_city" size="small" />
          <n-text>是否显示</n-text>
        </n-space> -->
      </setting-item>
    </setting-item-box>
    <setting-item-box name="市界遮罩" v-if="optionData.mapOptions.mapLevel!=='1'">
      <setting-item name='是否显示'>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.showPolygon_city" size="small" />
        </n-space>
      </setting-item>
      <template v-if="optionData.mapOptions.showPolygon_city">
        <setting-item name="是否显示遮罩名称">
          <n-space>
            <n-switch v-model:value="optionData.mapOptions.showPolygonName_city" size="small" />
          </n-space>
        </setting-item>
          <setting-item name='遮罩填充颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor_city.fillColor"></n-color-picker>
        </setting-item>
        <setting-item name='遮罩描边颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor_city.strokeColor"></n-color-picker>
        </setting-item>
        <setting-item name="遮罩透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.polygonColor_city.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
        </setting-item>
      </template>
    </setting-item-box>
    <setting-item-box name="区/县地图" v-if="optionData.mapOptions.mapLevel === '3'">
      <setting-item name="类型">
        <n-select size="small" v-model:value="optionData.mapOptions.mapMarkerType_district" :options="MarkerOptions" />
      </setting-item>
      <setting-item name="组件ID" v-if="optionData.mapOptions.mapMarkerType_district===MarkerEnum.COMPONENT">
        <n-input v-model:value="optionData.mapOptions.marker.id_district" size="small" ></n-input>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="区/县界掩模" :alone="true" v-if="optionData.mapOptions.mapLevel === '3'">
      <setting-item>
        <n-select size="small" v-model:value="optionData.mapOptions.showMask_district" :options="MaskOptions" />
        <!-- <n-space>
          <n-switch v-model:value="optionData.mapOptions.showMask_district" size="small" />
          <n-text>是否显示</n-text>
        </n-space> -->
      </setting-item>
    </setting-item-box>
    <setting-item-box name="区/县界遮罩"  v-if="optionData.mapOptions.mapLevel === '3'">
      <setting-item name='是否显示'>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.showPolygon_district" size="small"/>
        </n-space>
      </setting-item>
      <template v-if="optionData.mapOptions.showPolygon_district">
        <setting-item name="是否显示遮罩名称">
          <n-space>
            <n-switch v-model:value="optionData.mapOptions.showPolygonName_district" size="small"/>
          </n-space>
        </setting-item>
          <setting-item name='遮罩填充颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor_district.fillColor"></n-color-picker>
        </setting-item>
        <setting-item name='遮罩描边颜色'>
            <n-color-picker size="small"  v-model:value="optionData.mapOptions.polygonColor_district.strokeColor"></n-color-picker>
        </setting-item>
        <setting-item name="遮罩透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.polygonColor_district.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
        </setting-item>
      </template>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="图层" :expanded="true" v-if="!optionData.mapOptions.isOffLine">
    <setting-item-box name="卫星图层">
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.satelliteTileLayer.show" size="small" />
          <n-text>是否显示</n-text>
        </n-space>
      </setting-item>
      <setting-item name="叠加顺序值">
        <n-input-number
          v-model:value="optionData.mapOptions.satelliteTileLayer.zIndex"
          :min="0"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.satelliteTileLayer.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="缩放级别范围">
        <n-slider v-model:value="optionData.mapOptions.satelliteTileLayer.zooms" range :step="1" :max="18" :min="3" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="路网图层">
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.roadNetTileLayer.show" size="small" />
          <n-text>是否显示</n-text>
        </n-space>
      </setting-item>
      <setting-item name="叠加顺序值">
        <n-input-number
          v-model:value="optionData.mapOptions.roadNetTileLayer.zIndex"
          :min="0"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.roadNetTileLayer.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="缩放级别范围">
        <n-slider v-model:value="optionData.mapOptions.roadNetTileLayer.zooms" range :step="1" :max="18" :min="3" />
      </setting-item>
    </setting-item-box>
    <setting-item-box name="实时交通">
      <setting-item>
        <n-space>
          <n-switch v-model:value="optionData.mapOptions.trafficTileLayer.show" size="small" />
          <n-text>是否显示</n-text>
        </n-space>
      </setting-item>
      <setting-item name="叠加顺序值">
        <n-input-number
          v-model:value="optionData.mapOptions.trafficTileLayer.zIndex"
          :min="0"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="透明度">
        <n-input-number
          v-model:value="optionData.mapOptions.trafficTileLayer.opacity"
          :min="0"
          :max="1"
          step="0.1"
          size="small"
        ></n-input-number>
      </setting-item>
      <setting-item name="缩放级别范围">
        <n-slider v-model:value="optionData.mapOptions.trafficTileLayer.zooms" range :step="1" :max="18" :min="3" />
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType, ref,computed } from 'vue'
import { option, MarkerEnum, ThemeEnum, LangEnum, ViewModeEnum, ShowHideEnum, FeaturesEnum, MaskEnum } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import mapChinaJson from '../MapBase/mapGeojson/china.json'
const props =defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const mapRegionOptions = ref<{value:any,label:any}[]>([
  
])


const levelOptions = [
  {
    value: '3',
    label: '省市区三级'
  },
  {
    value: '2',
    label: '省市二级'
  },{
    value: '1',
    label: '省一级'
  },
]

const themeOptions = [
  {
    value: ThemeEnum.NORMAL,
    label: '标准'
  },
  {
    value: ThemeEnum.DARK,
    label: '幻影黑'
  },
  {
    value: ThemeEnum.LIGHT,
    label: '月光银'
  },
  {
    value: ThemeEnum.WHITES_MOKE,
    label: '远山黛'
  },
  {
    value: ThemeEnum.FRESH,
    label: '草色青'
  },
  {
    value: ThemeEnum.GREY,
    label: '雅士灰'
  },
  {
    value: ThemeEnum.GRAFFITI,
    label: '涂鸦'
  },
  {
    value: ThemeEnum.MACARON,
    label: '马卡龙'
  },
  {
    value: ThemeEnum.BLUE,
    label: '靛青蓝'
  },
  {
    value: ThemeEnum.DARKBLUE,
    label: '极夜蓝'
  },
  {
    value: ThemeEnum.WINE,
    label: '酱籽'
  }
]

const langOptions = [
  {
    value: LangEnum.ZH_CN,
    label: '中文简体'
  },
  {
    value: LangEnum.EN,
    label: '英文'
  },
  {
    value: LangEnum.ZH_EN,
    label: '中英文对照'
  }
]

const viewModeOptions = [
  {
    value: ViewModeEnum.PLANE,
    label: '2D'
  },
  {
    value: ViewModeEnum.STEREOSCOPIC,
    label: '3D'
  }
]

const featuresOptions = [
  {
    value: FeaturesEnum.BG,
    label: '区域面'
  },
  {
    value: FeaturesEnum.POINT,
    label: '标注'
  },
  {
    value: FeaturesEnum.ROAD,
    label: '道路'
  },
  {
    value: FeaturesEnum.BUILDING,
    label: '建筑物'
  }
]

const MarkerOptions = [
  {
    value: MarkerEnum.CIRCLE_MARKER,
    label: '圆形标点'
  },
  {
    value: MarkerEnum.MARKER,
    label: '定位标点'
  },
  {
    value: MarkerEnum.NONE,
    label: '隐藏标点'
  },
  {
    value:MarkerEnum.COMPONENT,
    label:'自定义标点'
  }
]
const MaskOptions = [
{
    value:MaskEnum.MAP,
    label:'所示地图边界'
},
{
    value:MaskEnum.TOTAL,
    label:'地图全掩'
},
{
    value:MaskEnum.NO,
    label:'不显示掩模'
}
]


const initMapRegionOptions = () => {
  mapChinaJson.features.forEach((element: any) => {
    if (element.properties.name) {
      mapRegionOptions.value.push({ ...element.properties,centerPos:element.properties.centroid?element.properties.centroid.join(','):element.properties.center?.join(',') })
    }
  })
}


const getAreaData = (area:any)=>{
  let areaData:any[] = []
  mapChinaJson.features.map(i=>{
    if (i.properties.centroid?.join(',') ===area) {
      areaData = i.geometry.coordinates[0]
    }
  })
  return areaData
}

const levelChange = (val:string)=>{
  switch (val) {
    case '2':
      props.optionData.mapOptions.showPolygon= true
      props.optionData.mapOptions.showMask = MaskEnum.MAP
      break;
    case '3':
      props.optionData.mapOptions.showPolygon_city= true
      props.optionData.mapOptions.showMask_city = MaskEnum.MAP
      break;
    default:
      break;
  }
  
}


const areaChange = (v:string,option: any)=>{
  props.optionData.mapRegion.curAreaInfo = option;
  [props.optionData.mapOptions.amapLon,props.optionData.mapOptions.amapLat] = v.split(',').map(i=>parseFloat(i))

}

initMapRegionOptions()
const mapRegion = computed(() => {
  return props.optionData.mapRegion
})
</script>
