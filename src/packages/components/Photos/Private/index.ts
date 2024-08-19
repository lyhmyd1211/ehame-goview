import { ChartFrameEnum, ConfigType, PackagesCategoryEnum } from '@/packages/index.d'
import { ImageConfig } from '@/packages/components/Informations/Mores/Image/index'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../index.d'
import { setLocalStorage, getLocalStorage, goDialog } from '@/utils'
import { StorageEnum } from '@/enums/storageEnum'
import { FileTypeEnum } from '@/enums/fileTypeEnum'
import { backgroundImageSize } from '@/settings/designSetting'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import { uploadFile } from '@/api/path/project.api'
import { ResultEnum } from '@/enums/httpEnum'

const StoreKey = StorageEnum.GO_USER_MEDIA_PHOTOS

/**
 * 上传完成事件类型
 */
type UploadCompletedEventType = {
  fileName: string
  url: string
  eventObj?:any
}

const userPhotosList: ConfigType[] = getLocalStorage(StoreKey) || []

const upload = (callback: ((arg0: UploadCompletedEventType)=>void) | null = null) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.png,.jpg,.jpeg,.gif' // 这里只允许部分图片类型
  input.onchange = async () => {
    if (!input.files || !input.files.length) return
    const file = input.files[0]
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
      console.log('上传可以',file);
      const newNameFile = new File([file], `${name}`, {
        type: type
      })
      let uploadParams = new FormData()
      uploadParams.append('object', newNameFile)
      const uploadRes = await uploadFile(uploadParams)
      if (uploadRes && uploadRes.code === ResultEnum.SUCCESS) {
        if (uploadRes.data.link) {
          const reader = new FileReader()
          reader.onload = () => {
            const eventObj: UploadCompletedEventType = { fileName: name, url: reader.result as string }
            callback && callback({fileName:name.split('.')[0],url:uploadRes.data.link,eventObj})
          }
          reader.readAsDataURL(file)
        } 
        return
      }
      window['$message'].error('添加图片失败，请稍后重试！')
    }else{
      window['$message'].error('添加图片失败，请稍后重试！')
    }
  }
  input.click()
}

const addConfig = {
  ...ImageConfig,
  category: ChatCategoryEnum.PRIVATE,
  categoryName: ChatCategoryEnumName.PRIVATE,
  package: PackagesCategoryEnum.PHOTOS,
  chartFrame: ChartFrameEnum.COMMON,
  title: '点击上传图片',
  image: 'upload.png',
  redirectComponent: `${ImageConfig.package}/${ImageConfig.category}/${ImageConfig.key}`, // 跳转组件路径规则：packageName/categoryName/componentKey
  disabled: true,
  configEvents: {
    // 点击上传事件
    addHandle: (photoConfig: ConfigType) => {
      upload((e: UploadCompletedEventType) => {
            // 和上传组件一样配置，更换标题，图片，预设数据
            const packagesStore = usePackagesStore()
            const newPhoto = {
              ...ImageConfig,
              category: ChatCategoryEnum.PRIVATE,
              categoryName: ChatCategoryEnumName.PRIVATE,
              package: PackagesCategoryEnum.PHOTOS,
              chartFrame: ChartFrameEnum.COMMON,
              title: e.fileName,
              image: e.eventObj.url,
              dataset: e.url,
              redirectComponent: `${ImageConfig.package}/${ImageConfig.category}/${ImageConfig.key}` // 跳转组件路径规则：packageName/categoryName/componentKey
            }
            userPhotosList.unshift(newPhoto)
            // 存储在本地数据中
            setLocalStorage(StoreKey, userPhotosList)
            // 插入到上传按钮前的位置
            packagesStore.addPhotos(newPhoto, 1)
          })
    }
  }
}

export default [addConfig, ...userPhotosList]
