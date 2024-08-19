import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MapAmapInfoWindowConfig: ConfigType = {
  key: 'MapAmapInfoWindow',
  chartKey: 'VMapAmapInfoWindow',
  conKey: 'VCMapAmapInfoWindow',
  title: '高德地图信息窗体',
  category: ChatCategoryEnum.MAP,
  categoryName: ChatCategoryEnumName.MAP,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'map_amap.png'
}
