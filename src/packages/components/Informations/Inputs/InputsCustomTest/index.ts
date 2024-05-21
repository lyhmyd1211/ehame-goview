import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const InputsCustomTestConfig: ConfigType = {
  key: 'InputsCustomTest',
  chartKey: 'VInputsCustomTest',
  conKey: 'VCInputsCustomTest',
  title: '测试自定义',
  category: ChatCategoryEnum.INPUTS,
  categoryName: ChatCategoryEnumName.INPUTS,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'inputs_select.png'
}
