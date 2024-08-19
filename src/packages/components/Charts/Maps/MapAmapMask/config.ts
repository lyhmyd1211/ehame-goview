import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { MapAmapMaskConfig } from './index'
import { chartInitConfig } from '@/settings/designSetting'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'
import { ComponentInteractEventEnum, interactActions } from './interact'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'

export enum ThemeEnum {
  NORMAL = 'normal',
  DARK = 'dark',
  LIGHT = 'light',
  WHITES_MOKE = 'whitesmoke',
  FRESH = 'fresh',
  GREY = 'grey',
  GRAFFITI = 'graffiti',
  MACARON = 'macaron',
  BLUE = 'blue',
  DARKBLUE = 'darkblue',
  WINE = 'wine'
}

export enum LangEnum {
  ZH_CN = 'zh_cn',
  EN = 'en',
  ZH_EN = 'zh_en'
}

export enum ViewModeEnum {
  PLANE = '2D',
  STEREOSCOPIC = '3D'
}

export const ShowHideEnum = {
  SHOW: true,
  HIDE: false
}

export enum FeaturesEnum {
  BG = 'bg',
  POINT = 'point',
  ROAD = 'road',
  BUILDING = 'building'
}

export enum MarkerEnum {
  // 圆圈
  CIRCLE_MARKER = 'CircleMarker',
  // 定位标点
  MARKER = 'Marker',
  // 暂无
  NONE = 'none',
  //自定义绑定组件
  COMPONENT ='component'
}
export enum MaskEnum {
  /**不显示掩模 */
  NO = 'no',
  /**根据地图范围显示掩模 */
  MAP = 'MAP',
  /**完全把地图遮挡 */
  TOTAL = 'total',

}

export const option = {
  dataset: dataJson,
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  mapRegion: {
    showHainanIsLands: true,
    enter: false,
    backSize: 20,
    backColor: '#ffffff',
    centerPos:'106.880455,26.826368',
    curAreaInfo:{
      name:'贵州省',
      adcode: '520000',
      polygon:''
    }
  },
  
  mapOptions: {

    filter:'invert(100%) sepia(100%) saturate(300%) hue-rotate(120deg) brightness(120%) contrast(80%)',
    offLineApi:'../../../../../public/MAP_zxy',
    isOffLine:false,

    pitch: 60,
    skyColor: '#53A9DE',
    amapKey: 'c487c515121d06ca31830f732fda5b5f',
    amapStyleKey: ThemeEnum.NORMAL,
    amapStyleKeyCustom: '',
    amapLon: 106.880455,
    amapLat: 26.826368,
    amapZindex: 8,
    mapLevel:'2',
    

    showMask:MaskEnum.MAP,
    showPolygon:true,
    showPolygonName:true,
    polygonColor:{
      fillColor:'#76cef7',
      strokeColor:'#00eeff',
      opacity:0.5,
    },

    showMask_city:MaskEnum.MAP,
    showPolygon_city:true,
    showPolygonName_city:true,
    polygonColor_city:{
      fillColor:'#76cef7',
      strokeColor:'#00eeff',
      opacity:0.5,
    },

    showMask_district:MaskEnum.MAP,
    showPolygon_district:true,
    showPolygonName_district:true,
    polygonColor_district:{
      fillColor:'#76cef7',
      strokeColor:'#00eeff',
      opacity:0.5,
    },
    hoverColor:'#1626FF',
    hoverOpacity:0.36,

    marker: {


      id:'',
      id_city:'',
      id_district:'',

      fillOpacity: 0.5,
      strokeColor: 'white',
      strokeWeight: 2,
      strokeOpacity: 0.5,
      zIndex: 10,
      bubble: true,
      cursor: 'pointer',
      clickable: true
    },
    mapMarkerType: MarkerEnum.CIRCLE_MARKER,
    mapMarkerType_city: MarkerEnum.CIRCLE_MARKER,
    mapMarkerType_district: MarkerEnum.CIRCLE_MARKER,
    viewMode: ViewModeEnum.PLANE,
    showLabel: ShowHideEnum.SHOW,
    satelliteTileLayer: {
      show: ShowHideEnum.HIDE,
      zIndex: 1,
      opacity: 1,
      zooms: [3, 18]
    },
    roadNetTileLayer: {
      show: ShowHideEnum.HIDE,
      zIndex: 2,
      opacity: 1,
      zooms: [3, 18]
    },
    trafficTileLayer: {
      show: ShowHideEnum.HIDE,
      zIndex: 3,
      opacity: 1,
      zooms: [3, 18]
    },
    lang: LangEnum.ZH_CN,
    features: [FeaturesEnum.BG, FeaturesEnum.POINT, FeaturesEnum.ROAD, FeaturesEnum.BUILDING]
  }
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = MapAmapMaskConfig.key
  public attr = { ...chartInitConfig, w: 1000, h: 800, zIndex: -1 }
  public chartConfig = cloneDeep(MapAmapMaskConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
