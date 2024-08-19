import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { IconConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { ComponentInteractEventEnum, interactActions } from './interact'

export const option = {
  // 图标名称
  dataset: 'uim:apple',
  color: '#03A9F4',
  size: 64,
  rotate: 0, // 旋转角度
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = IconConfig.key
  public attr = { ...chartInitConfig, w: 64, h: 64, zIndex: 1 }
  public chartConfig = cloneDeep(IconConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
