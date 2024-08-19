import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum,ChatCategoryEnumName } from '../../index.d'

export const TextDividerConfig: ConfigType = {
  key: 'TextDivider',
  chartKey: 'VTextDivider',
  conKey: 'VCTextDivider',
  title: '分割线',
  category: ChatCategoryEnum.TEXT,
  categoryName: ChatCategoryEnumName.TEXT,
  package: PackagesCategoryEnum.INFORMATIONS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'text_static.png'
}
