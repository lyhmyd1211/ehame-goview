import cloneDeep from 'lodash/cloneDeep'
import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { interactActions, ComponentInteractEventEnum } from './interact'
import { MapAmapInfoWindowConfig } from './index'
export const option = {
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  // 默认值
  modalTitle:'提示',
  showTitle:true,
  bg:'',
  bgScaleType:'100%',
  selectType:'100%',
  // 暴露配置内容给用户
  dataset: [] 
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  
  public isModalInstance = true
  public key = MapAmapInfoWindowConfig.key
  public attr = { ...chartInitConfig, w: 1160, h: 780, zIndex: -1 }
  public chartConfig = cloneDeep(MapAmapInfoWindowConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
