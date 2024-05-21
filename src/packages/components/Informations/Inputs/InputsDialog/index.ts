import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const InputsDialogConfig: ConfigType = {
  key: 'InputsDialog',
  chartKey: 'VInputsDialog',
  conKey: 'VCInputsDialog',
  title: '弹窗',
  category: ChatCategoryEnum.INPUTS,
  categoryName: ChatCategoryEnumName.INPUTS,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'inputs_select.png'
}
