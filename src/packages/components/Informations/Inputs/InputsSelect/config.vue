<template>
  <collapse-item name="样式" >
    <setting-item-box  name="颜色">
      <setting-item name="字体颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.fontColor"></n-color-picker>
      </setting-item>
      <setting-item name="背景颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.bgColor"></n-color-picker>
      </setting-item>
      <setting-item name="边框颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.borderColor"></n-color-picker>
      </setting-item>
      <setting-item name="边框激活颜色">
        <n-color-picker size="small" :modes="['hex']" v-model:value="optionData.borderActiveColor"></n-color-picker>
      </setting-item>
    </setting-item-box>
    <setting-item-box  name="背景" alone>
      <setting-item>
        <n-space>
        <n-switch v-model:value="optionData.customBg" size="small" />
        <n-text>是否自定义背景(不上传显示默认背景图)</n-text>
      </n-space>
      </setting-item>
    
      <setting-item name="主体背景" v-if="optionData.customBg">
        <div class="upload-box">
          <n-upload
            :show-file-list="false"
            :customRequest="(f:any)=>upload(f,'bg1')"
          >
            <n-upload-dragger>
              <div class="mask" v-if="optionData.bg1" @click.stop="optionData.bg1=''">
                <n-icon size="16">
                  <trash-icon></trash-icon>
                </n-icon>
              </div>
              <img v-if="optionData.bg1" class="upload-show" :src="optionData.bg1" alt="背景" />
              <div class="upload-img" v-show="!optionData.bg1">
                <img src="@/assets/images/canvas/noImage.png" />
                <n-text class="upload-desc" depth="3">
                  主体背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件
                </n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>
      </setting-item>
      <setting-item name="下拉框默认背景" style="margin-top: 10px" v-if="optionData.customBg">
        <div class="upload-box">
          <n-upload
            :show-file-list="false"
            :customRequest="(f:any)=>upload(f,'bg2')"
          >
            <n-upload-dragger>
              <div class="mask" v-if="optionData.bg2" @click.stop="optionData.bg2=''">
              <n-icon size="16" >
                <trash-icon></trash-icon>
              </n-icon>
              </div>
              <img v-if="optionData.bg2" class="upload-show" :src="optionData.bg2" alt="背景" />
              <div class="upload-img" v-show="!optionData.bg2">
                <img src="@/assets/images/canvas/noImage.png" />
                <n-text class="upload-desc" depth="3">
                  下拉框默认背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件
                </n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>
      </setting-item>
      <setting-item name="下拉框选中背景" style="margin-top: 10px" v-if="optionData.customBg">
        <div class="upload-box">
          <n-upload
            :show-file-list="false"
            :customRequest="(f:any)=>upload(f,'bg3')"
          >
            <n-upload-dragger>
              <div class="mask" v-if="optionData.bg3" @click.stop="optionData.bg3=''">
                <n-icon size="16">
                  <trash-icon></trash-icon>
                </n-icon>
              </div>
              <img v-if="optionData.bg3" class="upload-show" :src="optionData.bg3" alt="背景" />
              <div class="upload-img" v-show="!optionData.bg3">
                <img src="@/assets/images/canvas/noImage.png" />
                <n-text class="upload-desc" depth="3">
                  下拉框选中背景图需小于 {{ backgroundImageSize }}M ，格式为 png/jpg/gif 的文件
                </n-text>
              </div>
            </n-upload-dragger>
          </n-upload>
        </div>
      </setting-item>
    </setting-item-box>
  </collapse-item>
  <collapse-item name="下拉配置" :expanded="true">
    <setting-item-box name="默认值" :alone="true">
      <n-select size="small" v-model:value="optionData.selectValue" :options="optionData.dataset" style="max-width: 250px;"/>
    </setting-item-box>
    <setting-item-box name="筛选" >
      <n-space>
        <n-switch v-model:value="optionData.filterable"></n-switch>
        <n-text>是否可筛选</n-text>
      </n-space>
    </setting-item-box>
  </collapse-item>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox,SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { backgroundImageSize } from '@/settings/designSetting'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { ResultEnum } from '@/enums/httpEnum'
import { uploadFile } from '@/api/path/project.api'
import { icon } from '@/plugins'
const { TrashIcon } = icon.ionicons5
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const upload = async(f:any,bg:string) => {
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
      const newNameFile = new File([file.file], `${name.split('.')[0]}_select_bg.png`, {
        type: type
      })
      let uploadParams = new FormData()
      uploadParams.append('object', newNameFile)
      const uploadRes = await uploadFile(uploadParams)
      if (uploadRes && uploadRes.code === ResultEnum.SUCCESS) {
        if (uploadRes.data.link) {
          props.optionData[bg] = uploadRes.data.link
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
    
    .mask{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      padding: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      top: 0;
      left: 0;
      &:hover{
        opacity: 1;
      }
    }
    .n-upload-dragger {
        position: relative;
        padding: 5px;
        width: 200px;
        background-color: rgba(0, 0, 0, 0);
      }
    .upload-show {
      width: 150px;
      height: 80px;
      border-radius: 5px;
    }
    .upload-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 80px;
      }
      .upload-desc {
        padding: 10px 0;
      }
    }
  }
</style>
