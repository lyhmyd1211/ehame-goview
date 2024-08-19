import { nextTick, ref, toRefs,watch } from "vue"
import { MarkerEnum } from "../config"
import { JSONParse, JSONStringify, getScaleValues, getUUID, isArray } from "@/utils"
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore"
import { ModalListType } from "@/store/modules/chartEditStore/chartEditStore.d"

/**地图标记 */
export const useMarker = (option:any,AMapIns:any,mapIns:any,initMap:Function) => {  
  let markers: any = []
  let {
    mapMarkerType,
    mapMarkerType_city,
    mapMarkerType_district,
    marker,
  } = toRefs(option.mapOptions)
  // const markerComponentList = ref<any>([])
  const chartEditStore = useChartEditStore()
  const infoWindowInstance = ref()
  const drawMarker = (type:MarkerEnum,newData:any,temp:any)=>{
    markers.map(item=>{
      item.setMap(null)
    })
    markers = []
    if (type === MarkerEnum.MARKER) {
        newData.markers?.forEach((markerItem: any) => {
          const markerInstance = new AMapIns.Marker({
            position: [markerItem.position[0], markerItem.position[1]],
            offset: new AMapIns.Pixel(-13, -30),
            map:mapIns
          })
          markers.push(markerInstance)
          markerInstance.setMap(mapIns)
          addMarkerInfoWindow(markerInstance,markerItem.data)
        })
      } else if (type === MarkerEnum.CIRCLE_MARKER) {
        newData.markers?.forEach((markerItem: any) => {
          const markerInstance = new AMapIns.CircleMarker({
            center: [markerItem.position[0], markerItem.position[1]],
            radius: markerItem.value,
            ...marker.value,
            map:mapIns
          })
          markers.push(markerInstance)
          markerInstance.setMap(mapIns)
          addMarkerInfoWindow(markerInstance,markerItem.data)
        })
      }else if(type === MarkerEnum.COMPONENT){
        // let temp = chartEditStore.getComponentList.filter(i=>i.id===id)
        temp&&temp.length>0&&temp[0]?.option.dataset.markers?.map((markerItem: any,index:number) => {
            let position:any = []
            if (!markerItem.position) {
              let area = newData||chartEditStore.getCurApiData.area
              if (newData==='{}'||JSONStringify(newData)==='{}') {
                area = chartEditStore.getCurApiData.area
              }
            
              if (area==='{}'||JSONStringify(area)==='{}') {
                return;
              }
              if (!area.features) {
                area = JSONParse(area)
              }
              area?.features?.map(item=>{
                if (item.properties?.adcode==markerItem.name) {
                  position = item.properties.centroid||item.properties.center
                }
                  
              })
            }else{
                position = [markerItem.position[0], markerItem.position[1]]
            }
            let curid = getUUID()
            if (temp&&temp.length>0&&position.length>0) {
              chartEditStore.addShadowList({...temp[0],id:curid,option:{...temp[0].option,...markerItem,dataset:markerItem.dataset}})   
              nextTick(()=>{
              let dom = document.getElementById(curid)
              if (dom) {
                const markerInstance = new AMapIns.Marker({
                position,
                offset: new AMapIns.Pixel(-dom?.clientWidth/2, -dom?.clientHeight),
                radius: markerItem.value,
                ...marker.value,
                  content:dom,
                  map:mapIns
                })
              
                markers.push(markerInstance)
                markerInstance.setMap(mapIns)
                addMarkerInfoWindow(markerInstance,markerItem.dataset)
              }
            
            })
            }
          
          })

      }
  }
  const dataHandle = (newData: any,temp:any,cLevel:any) => {
    if (!mapIns && !AMapIns) {
      initMap(option)
      return
    }
      const hideOrigin = (id:string)=>{
        let originDom = document.getElementById(id)
        if (originDom) {
          originDom.style.display = 'none'
        }
      }

      marker.value.id&&hideOrigin(marker.value.id)
      marker.value.id_city&&hideOrigin(marker.value.id_city)
      marker.value.id_district&&hideOrigin(marker.value.id_district)
      let type = [
        mapMarkerType.value,
        mapMarkerType_city.value,
        mapMarkerType_district.value
      ]
      drawMarker(type[cLevel-1],newData,temp)
     
  }

  const clearWindow = ()=>{
    let IWindow = document.getElementsByClassName('amap-info')
    for (let index = 0; index < IWindow.length; index++) {
      const element = IWindow[index];
      element&&element.remove()
    }
    mapIns.clearInfoWindow()
  }

  const addMarkerInfoWindow =(markerInstance:any,postData:any) =>{
    
    if (option.modalId) {
      let dom = document.getElementById(option.modalId)
      if (dom) {
        markerInstance.on('click',(e)=>{
          let data:ModalListType  = {
            modalId:option.modalId,
            isShow:true,
            postData:postData
          } 
          chartEditStore.setModalList(data)
          option.replaceCommonEvent = true
          clearWindow()
          
          infoWindowInstance.value = new AMapIns.InfoWindow({
            isCustom:true,
            autoMove:false,
            content:dom,
            avoid:[0,0,0,0],
            anchor:'top-right'
          });
          infoWindowInstance.value.open(mapIns,markerInstance.getPosition())
          let IWindowNew = document.getElementsByClassName('amap-info')
          let windowContainer = document.getElementsByClassName('amap-info-contentContainer')
          nextTick(()=>{
            let w =  dom.clientWidth
            let h = dom.clientHeight
            const {scaleX,scaleY} =getScaleValues(dom)
            // for (let index = 0; index < IWindowNew.length; index++) {
            //   const element = IWindowNew[index];
              IWindowNew[0].style.width = w*scaleX+'px'
              IWindowNew[0].style.height = h*scaleY+'px'
              windowContainer[0].style.height = '100%'
            // }
          })
          mapIns.setFitView()
          mapIns.setZoomAndCenter(7,[markerInstance.getPosition().lng-1,markerInstance.getPosition().lat-1.5],false,200)
        })
      }
    }
  } 
  watch(()=>chartEditStore.getModalList,(newData)=>{
    console.log('modal变化',newData);
    if (newData.some(i=>i.modalId===option.modalId&&!i.isShow)) {
      clearWindow()
    }
    
  },{
    deep:true
  })
  return {
    marker,
    dataHandle
  }
}