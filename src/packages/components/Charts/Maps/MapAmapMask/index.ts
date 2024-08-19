import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MapAmapMaskConfig: ConfigType = {
  key: 'MapAmapMask',
  chartKey: 'VMapAmapMask',
  conKey: 'VCMapAmapMask',
  title: '高德地图自定义',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'map_amap.png'
}
