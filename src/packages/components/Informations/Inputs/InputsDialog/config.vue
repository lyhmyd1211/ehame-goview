<template>
    <setting-item-box name="头部" >
      <setting-item name="是否显示头部">
        <n-space>
          <n-switch v-model:value="optionData.showTitle" size="small"></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="标题" v-if="optionData.showTitle">
        <n-input v-model:value="optionData.modalTitle" size="small"></n-input>
      </setting-item>
    </setting-item-box>
    <collapse-item name="背景" :expanded="true">
        <!-- <n-upload size="small" @click="upload">上传背景图</n-upload> -->
         <setting-item-box name="适配方式">
            <n-space>
              <n-button-group>
                <n-button
                  v-for="item in previewTypeList"
                  :key="item.key"
                  :type="optionData.selectType === item.key ? 'primary' : 'tertiary'"
                  ghost
                  size="small"
                  @click="selectTypeFn(item.key)"
                >
                  <n-tooltip :show-arrow="false" trigger="hover">
                    <template #trigger>
                      <n-icon class="select-preview-icon" size="18">
                        <component :is="item.icon"></component>
                      </n-icon>
                    </template>
                    {{ item.desc }}
                  </n-tooltip>
                </n-button>
              </n-button-group>
              <n-input v-model:value="optionData.bgScaleType" placeholder="background-size属性值" v-if="optionData.selectType==='custom'"></n-input>
            </n-space>
         </setting-item-box>
         <setting-item-box name="背景图">
            <div class="upload-box">
            <n-upload
              :show-file-list="false"
              :customRequest="upload"
            >
              <n-upload-dragger>
                <img v-if="optionData.bg" class="upload-show" :src="optionData.bg" alt="背景" />
                <div class="upload-img" v-show="!optionData.bg">
                  <img src="@/assets/images/canvas/noImage.png" />
                  <n-text class="upload-desc" depth="3">
                    背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件
                  </n-text>
                </div>
              </n-upload-dragger>
            </n-upload>
          </div>
         </setting-item-box>
      <!-- <img :src="optionData.bg" style="display: block;width: 300px;"> -->
    </collapse-item>
    
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

const previewTypeList = [
  {
    key: 'contain',
    title: '自适应',
    icon: ScaleIcon,
    desc: '自适应比例展示，页面会有留白（contain）'
  },
  {
    key: 'cover',
    title: '原比例填充',
    icon: CenterToFitIcon,
    desc: '图片原始比例填充，超出部分被裁剪(cover)'
  },
  {
    key: '100%',
    title: 'x轴拉伸',
    icon: FitToWidthIcon,
    desc: 'X轴拉伸铺满，Y轴根据原比例变化，超出被裁剪(100%)'
  },
  {
    key: '100% 100%',
    title: '铺满',
    icon: FitToScreenIcon,
    desc: '强行拉伸画面，填充所有视图(100% 100%)'
  },{
    key: 'custom',
    title: '自定义',
    icon: ChartCustomIcon,
    desc: '自定义背景大小的值（css的background-size属性）'
  }
]

const selectTypeFn = (key:string)=>{
  props.optionData.selectType = key
  if (key!=='custom') {
    props.optionData.bgScaleType = key
  }
}


const upload = async(f:any) => {
    // if (!input.files || !input.files.length) return
    const file = f.file
    const { name, size, type } = file
    if (size > 1024 * 1024 * backgroundImageSize) {
      window['$message'].warning(`图片超出 ${backgroundImageSize}M 限制，请重新上传！`)
      return false
    }
    if (type !== FileTypeEnum.PNG && type !== FileTypeEnum.JPEG && type !== FileTypeEnum.GIF) {
      window['$message'].warning('文件格式不符合，请重新上传！')
      return false
    }
    if (file) {
      const newNameFile = new File([file.file], `${name.split('.')[0]}_dialog.png`, {
        type: type
      })
      let uploadParams = new FormData()
      uploadParams.append('object', newNameFile)
      const uploadRes = await uploadFile(uploadParams)
      if (uploadRes && uploadRes.code === ResultEnum.SUCCESS) {
        if (uploadRes.data.link) {
          props.optionData.bg = uploadRes.data.link
        } 
        return
      }
      window['$message'].error('添加背景图片失败，请稍后重试！')
    }else{
      window['$message'].error('添加背景图片失败，请稍后重试！')
    }
}

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
