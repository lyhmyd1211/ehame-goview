import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { ImageConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import logo from '@/assets/logo.png'
import { ComponentInteractEventEnum, interactActions } from './interact'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'

export const option = {
  // 图片路径
  dataset: logo,
  // 适应方式
  fit: 'contain',
  // 圆角
  borderRadius: 10,
  isFnBtn:false,
  isTooltip:false,
  tooltipName:'',
  apiUrl:'',
  apiParam:'',
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
}

export default class Config extends PublicConfigClass implements CreateComponentType
{
  public key = ImageConfig.key
  public chartConfig = cloneDeep(ImageConfig)
  public interactActions = interactActions
  public option = cloneDeep(option)
}
