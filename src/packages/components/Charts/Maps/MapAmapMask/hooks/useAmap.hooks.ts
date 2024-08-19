import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, PropType, toRefs, watch, computed, onMounted, nextTick } from 'vue'
import { useMaskandPolygon } from './useMaskandPolygon.hooks'
import { debounce, throttle } from 'lodash'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { getAdministrativeLevel, getUpperLevelCode } from '@/utils'
/**
 * 高德地图
 * @param config   初始config
 * @param vChartRef   地图domref
 * @param changeMap   缩放事件
 * @returns 
 */
export const useAmap = (config:any,vChartRef:any,
  changeMap:Function,changePlusMap:Function,changeReduceMap:Function,curHoverPolygon:any) => {
  const securityJsCode= "d67dd1015daccb740b722a93f8700614"
  let AMapIns:any = null
  let mapIns:any = null
  const firstMask = ref()
  const curLevel = ref(1)
  const curOption = ref()
  let {
    amapKey,
    amapStyleKey,
    amapLon,
    amapLat,
    amapZindex,
    lang,
    amapStyleKeyCustom,
    features,
    viewMode,
    showLabel,
    pitch,
    skyColor,
    satelliteTileLayer,
    roadNetTileLayer,
    trafficTileLayer,
    mapLevel,
  } = toRefs(config.option.mapOptions)
  const beingZoom = ref(false)
  const zoomFreeze = ref(false)
  const preZoom = ref(amapZindex.value)

  const transformStyle = ref()
  /**解决缩放高德地图鼠标位置错位 */
  const changeTransform = ()=>{
    let dom = document.getElementsByClassName('go-preview-scale')
    let scale = dom[0]?.style.transform.replaceAll('scale(','').replaceAll(')','').replace(/\s+/g, "").split(',')
    if (scale?.length>0) {
      transformStyle.value = 
      `transform:scale(${1 / scale[0]},${1/scale[1]});
      width:${config.attr.w*scale[0]}px;
      height:${config.attr.h*scale[1]}px;
      background-color: rgba(0,0,0,0)!important;
      background-image: none;
      transform-origin: top left;
      `
    }
  }

 


  const chartEditStore = useChartEditStore()
  const initMap = (newData: any,callback?:Function) => {
    window._AMapSecurityConfig = {
      securityJsCode,
    };
    // 初始化
    AMapLoader.reset()
    AMapLoader.load({
      key: amapKey.value, //api服务key--另外需要在public中使用安全密钥！！！
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] // 需要使用的的插件列表
    })
      .then(AMap => {
        AMapIns = AMap
        mapIns = new AMap.Map(vChartRef.value, {
          resizeEnable: true,
          zoom: amapZindex.value, // 地图显示的缩放级别
          center: [amapLon.value, amapLat.value],
          lang: lang.value,
          features: features.value,
          pitch: pitch.value, // 地图俯仰角度，有效范围 0 度- 83 度
          skyColor: skyColor.value,
          viewMode: viewMode.value, // 地图模式
          showLabel: showLabel.value, // 是否显示地图文字标记
          willReadFrequently: true,
        })
        // dataHandle(option.dataset)
        
        let satelliteLayer = new AMap.TileLayer.Satellite({
          zIndex: satelliteTileLayer.value.zIndex,
          opacity: satelliteTileLayer.value.opacity,
          zooms: satelliteTileLayer.value.zooms
        })
        let roadNetLayer = new AMap.TileLayer.RoadNet({
          zIndex: roadNetTileLayer.value.zIndex,
          opacity: roadNetTileLayer.value.opacity,
          zooms: roadNetTileLayer.value.zooms
        })
        let trafficLayer = new AMap.TileLayer.Traffic({
          zIndex: trafficTileLayer.value.zIndex,
          opacity: trafficTileLayer.value.opacity,
          zooms: trafficTileLayer.value.zooms
        })
        mapIns.remove([satelliteLayer, roadNetLayer, trafficLayer])
        if (satelliteTileLayer.value.show) {
          mapIns.add([satelliteLayer])
        }
        if (roadNetTileLayer.value.show) {
          mapIns.add([roadNetLayer])
        }
        if (trafficTileLayer.value.show) {
          mapIns.add([trafficLayer])
        }
  
        mapIns.setMapStyle(
          `amap://styles/${amapStyleKeyCustom.value !== '' ? amapStyleKeyCustom.value : amapStyleKey.value}`
        )




        /**初始化省地图掩膜和遮罩 */
        // if (config.option.mapOptions.showPolygon) {
        //   add(config.option.mapRegion.curAreaInfo.adcode)
         
        // }
        let scrolled = false;
        function handleWheel(this: any, event:any) {
          event.preventDefault()
          let zoom = mapIns.getZoom()
          if (!scrolled) {
            if (curHoverPolygon.value) {
              if (event.deltaY < 0) {
                  // 放大操作
                  changeLevel('g')
                   // 移除事件监听，确保之后不会再触发
            this.removeEventListener('wheel', handleWheel);
            scrolled = true
              } else {
                  // 缩小操作
                  changeLevel('l')
                   // 移除事件监听，确保之后不会再触发
            this.removeEventListener('wheel', handleWheel);
            scrolled = true
              }
            }
          }
          setTimeout(() => {
            scrolled = false
          }, 500);
          
         
      }
        let ele = vChartRef.value
        ele.addEventListener('wheel', debounce(handleWheel),300);

      

       
        


        const changeLevel=(type:'g'|'l')=>{
          if (type==='g') { //放大
            console.log('放大',curHoverPolygon.value.adcode);
            if (getAdministrativeLevel(chartEditStore.getCurApiData.code)!== parseInt(mapLevel.value)) {
              changeMap(curHoverPolygon.value.adcode)
              changePlusMap(curHoverPolygon.value.adcode)
            }
          }else if (type === 'l') { //缩小
            if (getAdministrativeLevel(chartEditStore.getCurApiData.code)!==1) {
              changeMap(getUpperLevelCode(chartEditStore.getCurApiData.code))
              changeReduceMap(getUpperLevelCode(chartEditStore.getCurApiData.code))
              }
            // }else if(getAdministrativeLevel(chartEditStore.getCurApiData.code)===2){
            //   changeMap(chartEditStore.getCurApiData.code+'')
            //   changeReduceMap(chartEditStore.getCurApiData.code+'')
            // }
           
            // changeMap(firstMask.value.maskData.code)
            // changeReduceMap(firstMask.value.maskData.code)
          }
          
        }

        changeTransform()
        // zoomEventOn()
        callback&&callback(mapIns,AMapIns)
      })
      .catch(e => {})
  }

  

    
  

  onMounted(()=>{
    window.addEventListener('resize',()=>{
      changeTransform()
    })
  })

  return {
    AMapIns,
    mapIns,
    firstMask,
    transformStyle,
    curLevel,
    beingZoom,
    initMap,
    changeTransform,
    
  }
}
