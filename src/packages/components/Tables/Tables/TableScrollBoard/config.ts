import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { TableScrollBoardConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'
import { ComponentInteractEventEnum, interactActions } from './interact'
import { COMPONENT_INTERACT_EVENT_KET } from '@/enums/eventEnum'
export const option = {
  [COMPONENT_INTERACT_EVENT_KET]: ComponentInteractEventEnum.DATA,
  header: ['列1', '列2', '列3'],
  dataset: dataJson,
  index: true,
  columnWidth: [30, 100, 100],
  align: ['center', 'right', 'right', 'right'],
  rowNum: 5,
  waitTime: 2,
  headerHeight: 35,
  carousel: 'single',
  headerBGC: '#00BAFF',
  oddRowBGC: '#003B51',
  evenRowBGC: '#0A2732'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = TableScrollBoardConfig.key
  public interactActions = interactActions
  public chartConfig = cloneDeep(TableScrollBoardConfig)
  public option = cloneDeep(option)
}
