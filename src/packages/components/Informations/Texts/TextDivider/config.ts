import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { TextDividerConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export enum WritingModeEnum {
  HORIZONTAL = '水平',
  VERTICAL = '垂直'
}

export const WritingModeObject = {
  [WritingModeEnum.HORIZONTAL]: 'horizontal-tb',
  [WritingModeEnum.VERTICAL]: 'vertical-rl'
}

export enum FontWeightEnum {
  NORMAL = '常规',
  BOLD = '加粗',
}

export const FontWeightObject = {
  [FontWeightEnum.NORMAL]: 'normal',
  [FontWeightEnum.BOLD]: 'bold',
}

export enum LineTypeEnum {
  SOLID = '实线',
  DASHED = '虚线',
}

export const LineTypeObject = {
  [LineTypeEnum.SOLID]: 'solid',
  [LineTypeEnum.DASHED]: 'dashed',
}

export enum TitlePlacementEnum {
  LEFT = '左',
  CENTER = '中',
  RIGHT='右'
}

export const TitlePlacementObject = {
  [TitlePlacementEnum.LEFT]: 'left',
  [TitlePlacementEnum.CENTER]: 'center',
  [TitlePlacementEnum.RIGHT]: 'right',
}

export enum OrientationEnum {
  HORIZONTAL = '水平',
  VERTICAL = '垂直',
}

export const OrientationObject = {
  [OrientationEnum.HORIZONTAL]: 'horizontal',
  [OrientationEnum.VERTICAL]: 'vertical',
}

export const option = {

  lineType:'solid',
  titlePlacement:'center',
  orientation:'horizontal',

  lineWidth:1,
  lineColor:'rgb(239, 239, 245)',

  link: '',
  linkHead: 'http://',
  dataset: '我是文本',
  fontSize: 20,
  fontColor: '#ffffff',
  paddingX: 10,
  paddingY: 10,
  textAlign: 'center', // 水平对齐方式
  fontWeight: 'normal',

  // 边框
  borderWidth: 0,
  borderColor: '#ffffff',
  borderRadius: 5,

  // 字间距
  letterSpacing: 5,
  writingMode: 'horizontal-tb',
  backgroundColor: '#00000000'
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = TextDividerConfig.key
  public chartConfig = cloneDeep(TextDividerConfig)
  public option = cloneDeep(option)
}
