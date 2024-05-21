import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const InputsTreeConfig: ConfigType = {
  key: 'InputsTree',
  chartKey: 'VInputsTree',
  conKey: 'VCInputsTree',
  title: '树形数据',
  category: ChatCategoryEnum.INPUTS,
  categoryName: ChatCategoryEnumName.INPUTS,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'inputs_select.png'
}
