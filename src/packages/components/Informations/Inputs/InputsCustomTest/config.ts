import cloneDeep from 'lodash/cloneDeep'
import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { interactActions, ComponentInteractEventEnum } from './interact'
import { InputsCustomTestConfig } from './index'
import dataJson from './data.json'
export const option = {
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  // 默认值
  selectValue: '1',
  // 暴露配置内容给用户
  dataset: { ...dataJson }
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = InputsCustomTestConfig.key
  public attr = { ...chartInitConfig, w: 260, h: 300, zIndex: -1 }
  public chartConfig = cloneDeep(InputsCustomTestConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
