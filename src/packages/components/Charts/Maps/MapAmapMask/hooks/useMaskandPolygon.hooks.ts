import { ref } from "vue";
import { MaskEnum } from "../config";
import { JSONStringify, getAdministrativeLevel, getBoundingBox } from "@/utils";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";

let world = [[[-360,90],[-360,-90],[360,-90],[360,90]]]
/**地图掩模和多边形遮罩 */
export const useMaskandPolygon = (mapIns:any,AMapIns:any,config:any,beingZoom:any,curHoverPolygon:any) => {  
  // const curHoverPolygon = ref<any>()
  const PolygonList = ref<any>([])
  const mask = ref([])
  const readGeoJson = (code:string,ApiData:any,callback?:Function)=>{
    if (ApiData&&JSONStringify(ApiData)!="{}") {
      new Promise((resolve,reject)=>{
        resolve(ApiData)
      }).then(res=>{
        callback&&callback(res)
      })
    }else{
      code&&import(`../../MapBase/mapGeojson/${code}.json`).then((res)=>{
        callback&&callback(res)
      })
    }

  
  }
  const fitView = (res:any)=>{
    
    if (!res) {
      return;
    }
    let box = getBoundingBox(res)
    if (box) {
      let fit = mapIns.getFitZoomAndCenterByBounds(new AMapIns.Bounds(new AMapIns.LngLat(box.southWest[0],box.southWest[1]),new AMapIns.LngLat(box.northEast[0],box.northEast[1])))
      mapIns.setZoomAndCenter(fit[0],fit[1],false,200)
    }
   
  }
  const customAddMask = (show:MaskEnum,mapArea:any)=>{
    switch (show) {
      case MaskEnum.MAP:
        addMask(mapArea)
        break;
      case MaskEnum.TOTAL:
        addMask([])
        break;
      case MaskEnum.NO:
        addMask(world)
        break;
      default:
        addMask(mapArea)
        break;
    }
  }
    /**添加掩膜 */
  const addMask = (bounds:any)=>{
    mapIns.setMask(bounds);
    mask.value = bounds
  }

  /**
  * 移除多边形
  * @param Polygon 多边形或多边形数组
  */
  const removePolygon=(Polygon:any|any[])=>{
    if (Array.isArray(Polygon)) {
      Polygon.map((item: any)=>{
        mapIns.remove(item)
        item.destroy()
    })
  }else{
    mapIns.remove(Polygon)
    Polygon.destroy()
  }
  }

  const chartEditStore = useChartEditStore()

  const textList = ref<any[]>([])
  
  /**添加多边形 */
  const addPolygon = (code:string,color:any,name:boolean,ApiData?:any,callback?:any)=>{
    removePolygon(PolygonList.value)
    textList.value.map(item=>{
      item.setMap(null)
    })
    textList.value = []
    code&&readGeoJson(code,ApiData,(res)=>{
      chartEditStore.setCurApiData({area:res,code})
      let maskData:any[] = []
      res?.features?.map((item:any,index:number)=>{
        let pathArray = [
          ...item.geometry.coordinates
        ]
        maskData.push(...item.geometry.coordinates)
        let recordPolygon = new AMapIns.Polygon({
              path:pathArray,
              strokeColor: color.strokeColor.slice(0,7)||'#00eeff',
              strokeWeight: 1,
              fillColor: color.fillColor.slice(0,7)||'#76cef7',
              fillOpacity: (color.opacity||color.opacity===0)?color.opacity:0.5,
              extData:item.properties
          });
          recordPolygon.setPath(pathArray);
          recordPolygon.on('mouseover',(e)=>{
            recordPolygon.setOptions({
              fillOpacity:config.option.mapOptions.hoverOpacity||'#1626FF',
              fillColor:config.option.mapOptions.hoverColor||0.8,
            })
           
            if (!beingZoom.value) {
              curHoverPolygon.value = recordPolygon.getOptions().extData
            }
          })
          recordPolygon.on('mouseout',(e)=>{
            recordPolygon.setOptions({
              fillOpacity:(color.opacity||color.opacity===0)?color.opacity:0.5
            })
            curHoverPolygon.value = ''
          })
          if (name) {
            const text = new AMapIns.Text({
              text:item.properties.name,
              anchor:'center', // 设置文本标记锚点
              draggable:false,
              cursor:'pointer',
              offset:[0,10],
              zooms:[5,20],
              zIndex:9,
              style:{
                  'border-width': 0,
                  'text-align': 'center',
                  'font-size': '12px',
                  'color': '#fff',
                  'background-color':'rgba(0,0,0,0)',
                  'zIndex':0,
              },
              position: item.properties.centroid||item.properties.center
          });
      
          text.setMap(mapIns);
          textList.value.push(text)
          }
           
          PolygonList.value.push(recordPolygon)
          mapIns&&mapIns?.add(recordPolygon)
      })
      callback&&callback(maskData)
  })

  


  }


  let showMaskMap = [
    config.option.mapOptions.showMask,
    config.option.mapOptions.showMask_city,
    config.option.mapOptions.showMask_district
    ]
    let showPolygonMap = [
    config.option.mapOptions.showPolygon,
    config.option.mapOptions.showPolygon_city,
    config.option.mapOptions.showPolygon_district
    ]
    let polygonColor = [
      config.option.mapOptions.polygonColor,
      config.option.mapOptions.polygonColor_city,
      config.option.mapOptions.polygonColor_district
    ]
    let polygonName = [
      config.option.mapOptions.showPolygonName,
      config.option.mapOptions.showPolygonName_city,
      config.option.mapOptions.showPolygonName_district
    ]
  const add = (code:string,ApiData:any)=>{
    let level = getAdministrativeLevel(code)
    showPolygonMap[level-1]&&addPolygon(code,polygonColor[level-1],polygonName[level-1],ApiData,(maskData:any)=>{
      customAddMask(showMaskMap[level-1],maskData)
      setTimeout(() => {
        fitView(chartEditStore.getCurApiData.area)
      }, 1);
    })
  }


  return {
    PolygonList,
    mask,
    add,
    addPolygon,
    addMask,
    removePolygon,
    customAddMask
  }
}