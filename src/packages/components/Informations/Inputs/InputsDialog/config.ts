import cloneDeep from 'lodash/cloneDeep'
import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { interactActions, ComponentInteractEventEnum } from './interact'
import { InputsDialogConfig } from './index'
import dataJson from './data.json'
export const option = {
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  // 默认值
  isShow: false,
  clickData:{},
  // 暴露配置内容给用户
  dataset: [ ...dataJson.source] 
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  
  public isModalInstance = true
  public key = InputsDialogConfig.key
  public attr = { ...chartInitConfig, w: 260, h: 300, zIndex: -1 }
  public chartConfig = cloneDeep(InputsDialogConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
