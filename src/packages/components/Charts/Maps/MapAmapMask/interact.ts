import { InteractEventOn, InteractActionsType } from '@/enums/eventEnum'

export enum ComponentInteractEventEnum {
  DATA = 'data'
}

// 联动参数, 这个值就是传给其它组件的的 key
export enum ComponentInteractParamsEnum {
  DATA = 'data'
}

// 定义组件触发回调事件
export const interactActions: InteractActionsType[] = [
  {
    // 这里是事件触发的方式
    interactType: InteractEventOn.ZOOM,
    interactName: '缩放',
    componentEmitEvents: {
      // 这个是组件的类型,大部分组件只有一种展示类型, 多种类型的写法参考【时间选择】组件
      [ComponentInteractEventEnum.DATA]: [
        {
          value: ComponentInteractParamsEnum.DATA,
          label: '选择项'
        }
      ]
    }
  },
  {
    // 这里是事件触发的方式
    interactType: InteractEventOn.ZOOMPlus,
    interactName: '放大',
    componentEmitEvents: {
      // 这个是组件的类型,大部分组件只有一种展示类型, 多种类型的写法参考【时间选择】组件
      [ComponentInteractEventEnum.DATA]: [
        {
          value: ComponentInteractParamsEnum.DATA,
          label: '选择项'
        }
      ]
    }
  },
  {
    // 这里是事件触发的方式
    interactType: InteractEventOn.ZoomReduce,
    interactName: '缩小',
    componentEmitEvents: {
      // 这个是组件的类型,大部分组件只有一种展示类型, 多种类型的写法参考【时间选择】组件
      [ComponentInteractEventEnum.DATA]: [
        {
          value: ComponentInteractParamsEnum.DATA,
          label: '选择项'
        }
      ]
    }
  }
]