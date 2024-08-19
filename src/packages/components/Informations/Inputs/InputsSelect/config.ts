import cloneDeep from 'lodash/cloneDeep'
import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { chartInitConfig } from '@/settings/designSetting'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
import { interactActions, ComponentInteractEventEnum } from './interact'
import { InputsSelectConfig } from './index'

export const option = {
  // 时间组件展示类型，必须和 interactActions 中定义的数据一致
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  // 默认值
  selectValue: '1',
  // 暴露配置内容给用户
  dataset: [
    {
      label: '选项1',
      value: '1'
    },
    {
      label: '选项2',
      value: '2'
    },
    {
      label: '选项3',
      value: '3'
    }
  ],
  bgColor:'#ffffff00',
  fontColor:'#000',
  borderColor:'#e0e0e6',
  borderActiveColor:'#51d6a9',
  customBg:false,
  bg1:'',
  bg2:'',
  bg3:'',
  filterable:false,
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = InputsSelectConfig.key
  public attr = { ...chartInitConfig, w: 260, h: 32, zIndex: -1 }
  public chartConfig = cloneDeep(InputsSelectConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
