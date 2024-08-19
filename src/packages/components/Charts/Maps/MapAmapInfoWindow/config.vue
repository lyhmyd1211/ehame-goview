<template>
    
</template>

<script lang="ts" setup>
import { PropType,Ref, ref } from 'vue'
import { CollapseItem, SettingItemBox,SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { backgroundImageSize } from '@/settings/designSetting'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { uploadFile } from '@/api/path/project.api'
import { ResultEnum } from '@/enums/httpEnum'
import { icon } from '@/plugins'

const { ScaleIcon, FitToScreenIcon, CenterToFitIcon, FitToWidthIcon,ChartCustomIcon } = icon.carbon

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  },
  targetData:{
    type:Object as PropType<CreateComponentType | CreateComponentGroupType>
  }
})



</script>
<style lang="scss" scoped>
 .upload-box {
    cursor: pointer;
    margin-bottom: 20px;
    .n-upload-dragger {
        padding: 5px;
        width: 250px;
        background-color: rgba(0, 0, 0, 0);
      }
    .upload-show {
      width: 200px;
      height: 120px;
      border-radius: 5px;
    }
    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 100px;
      }
      .upload-desc {
        padding: 10px 0;
      }
    }
  }
</style>
