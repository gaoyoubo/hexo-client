import { ipcRenderer } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'
import router from './router'

// 百度统计
const BAIDU_SITE_ID = '4b0947c1973db3139b436d8583b3fc00'
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)
