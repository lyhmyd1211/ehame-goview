<template>
  <div class="go-chart-configurations-data-ajax">
    <n-card class="n-card-shallow">
      <setting-item-box name="请求配置">
        <setting-item name="类型">
          <n-tag :bordered="false" type="primary" style="border-radius: 5px">
            {{ trueData.request.requestContentType === RequestContentTypeEnum.DEFAULT ? '普通请求' : 'SQL请求' }}
          </n-tag>
        </setting-item>

        <setting-item name="方式">
          <n-input size="small" :placeholder="trueData.request.requestHttpType || '暂无'" :disabled="true"></n-input>
        </setting-item>

        <setting-item name="组件间隔">
          <n-input size="small" :placeholder="`${trueData.request.requestInterval || '暂无'}`" :disabled="true">
            <template #suffix> {{ SelectHttpTimeNameObj[trueData.request.requestIntervalUnit] }} </template>
          </n-input>
        </setting-item>

        <setting-item name="全局间隔（默认）">
          <n-input size="small" :placeholder="`${GlobalRequestInterval || '暂无'} `" :disabled="true">
            <template #suffix> {{ SelectHttpTimeNameObj[GlobalRequestIntervalUnit] }} </template>
          </n-input>
        </setting-item>
      </setting-item-box>

      <setting-item-box name="源地址" :alone="true">
        <n-input size="small" :placeholder="requestOriginUrl || '暂无'" :disabled="true">
          <template #prefix>
            <n-icon :component="PulseIcon" />
          </template>
        </n-input>
      </setting-item-box>

      <setting-item-box name="组件地址" :alone="true">
        <n-input size="small" :placeholder="trueData.request.requestUrl || '暂无'" :disabled="true">
          <template #prefix>
            <n-icon :component="FlashIcon" />
          </template>
        </n-input>
      </setting-item-box>

      <div class="edit-text" @click="requestModelHandle">
        <div class="go-absolute-center">
          <n-button type="primary" secondary>编辑配置</n-button>
        </div>
      </div>
    </n-card>

    <setting-item-box :alone="true">
      <template #name>
        测试
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="21" :depth="3">
              <help-outline-icon></help-outline-icon>
            </n-icon>
          </template>
          默认赋值给 dataset 字段
        </n-tooltip>
      </template>
      <n-button type="primary" ghost @click="sendHandle">
        <template #icon>
          <n-icon>
            <flash-icon />
          </n-icon>
        </template>
        发送请求
      </n-button>
    </setting-item-box>

    <!-- 底部数据展示 -->
    <chart-data-matching-and-show :show="showMatching && !loading" :ajax="true"></chart-data-matching-and-show>

    <!-- 骨架图 -->
    <go-skeleton :load="loading" :repeat="3"></go-skeleton>
    
    <!-- 请求配置model -->
    <chart-data-request
      v-model:modelShow="requestShow"
      :targetData="trueData"
      @sendHandle="sendHandle"
    ></chart-data-request>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onBeforeUnmount, watchEffect, toRaw } from 'vue'
import { icon } from '@/plugins'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { ChartDataRequest } from '../ChartDataRequest/index'
import { RequestHttpEnum, ResultEnum, SelectHttpTimeNameObj, RequestContentTypeEnum } from '@/enums/httpEnum'
import { chartDataUrl, rankListUrl, scrollBoardUrl, numberFloatUrl, numberIntUrl, textUrl, imageUrl } from '@/api/mock'
import { http, customizeHttp } from '@/api/http'
import { SelectHttpType } from '../../index.d'
import { ChartDataMatchingAndShow } from '../ChartDataMatchingAndShow'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { newFunctionHandle } from '@/utils'

const { HelpOutlineIcon, FlashIcon, PulseIcon } = icon.ionicons5
const { targetData,chartEditStore } = useTargetData()
const trueData = computed(()=>{
  const selectId = chartEditStore.getTargetChart.selectId
  if (selectId&&selectId.length>0) {
    if (targetData.value?.id!==selectId[0]) {
      let data = targetData.value?.groupList?.filter(i=>i.id===selectId[0])
      if (data&&data.length>0) {
        return data[0]
      }
    }
  }
  return targetData.value
})

const {
  requestOriginUrl,
  requestInterval: GlobalRequestInterval,
  requestIntervalUnit: GlobalRequestIntervalUnit
} = toRefs(chartEditStore.getRequestGlobalConfig)
const designStore = useDesignStore()

// 是否展示数据分析
const loading = ref(false)
const requestShow = ref(false)
const showMatching = ref(false)

let firstFocus = 0
let lastFilter: any = undefined

// 请求配置 model
const requestModelHandle = () => {
  requestShow.value = true
}

// 发送请求
const sendHandle = async () => {
  if (!trueData.value?.request) return
  loading.value = true
  try {
    const res = await customizeHttp(toRaw(trueData.value.request), toRaw(chartEditStore.getRequestGlobalConfig))
    loading.value = false
    if (res) {
      const { data } = res
      if (!data && !trueData.value.filter) {
        window['$message'].warning('您的数据不符合默认格式，请配置过滤器！')
        showMatching.value = true
        return
      }
      trueData.value.option.dataset = newFunctionHandle(data, res, trueData.value.filter)
      showMatching.value = true
      return
    }
    window['$message'].warning('没有拿到返回值，请检查接口！')
  } catch (error) {
    console.error(error);
    loading.value = false
    window['$message'].warning('数据异常，请检查参数！')
  }
}

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

watchEffect(() => {
  const filter = trueData.value?.filter
  if (lastFilter !== filter && firstFocus) {
    lastFilter = filter
    sendHandle()
  }
  firstFocus++
})

onBeforeUnmount(() => {
  lastFilter = null
})
</script>

<style lang="scss" scoped>
@include go('chart-configurations-data-ajax') {
  .n-card-shallow {
    &.n-card {
      @extend .go-background-filter;
      @include deep() {
        .n-card__content {
          padding: 10px;
        }
      }
    }
    .edit-text {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 325px;
      height: 270px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      @extend .go-background-filter;
      backdrop-filter: blur(2px) !important;
    }
    &:hover {
      border-color: v-bind('themeColor');
      .edit-text {
        opacity: 1;
      }
    }
  }
}
</style>
