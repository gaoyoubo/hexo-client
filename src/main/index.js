'use strict'

import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron'
import { ebtMain } from 'electron-baidu-tongji'
import path from 'path'
import i18next from 'i18next'
import NodeFsBackend from 'i18next-node-fs-backend'
import LanguageDetector from 'i18next-electron-language-detector'

// 百度统计
ebtMain(ipcMain)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true
  })

  mainWindow.maximize()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  /**
   * 窗口加载完之后显示
   */
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

function createMenu () {
  const template = [
    {
      label: i18next.t('edit'),
      submenu: [
        {
          label: i18next.t('new'),
          accelerator: 'Shift+CmdOrCtrl+N',
          click: function (item, focusedWindow) {
            if (mainWindow) {
              mainWindow.webContents.send('createPost')
            }
          }
        },
        {
          label: i18next.t('search'),
          accelerator: 'Shift+CmdOrCtrl+F',
          click: function (item, focusedWindow) {
            if (mainWindow) {
              mainWindow.webContents.send('showSearch')
            }
          }
        },
        {
          label: i18next.t('publish'),
          accelerator: 'Shift+CmdOrCtrl+D',
          click: function (item, focusedWindow) {
            if (mainWindow) {
              mainWindow.webContents.send('doDeploy')
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: i18next.t('undo'),
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: i18next.t('redo'),
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          label: i18next.t('cut'),
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: i18next.t('copy'),
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: i18next.t('paste'),
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: i18next.t('selectall'),
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: i18next.t('view'),
      submenu: [
        {
          label: i18next.t('reload'),
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              // 重载之后, 刷新并关闭所有的次要窗体
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach(function (win) {
                  if (win.id > 1) {
                    win.close()
                  }
                })
              }
              focusedWindow.reload()
            }
          }
        },
        {
          label: i18next.t('fullScreen'),
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        },
        {
          label: i18next.t('devTools'),
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }
        }
      ]
    },
    {
      label: i18next.t('about'),
      submenu: [
        {
          label: i18next.t('about'),
          click: function () {
            if (mainWindow) {
              mainWindow.webContents.send('about')
            }
          }
        },
        {
          label: i18next.t('help'),
          click: function () {
            shell.openExternal('https://www.mspring.org/2018/11/29/HexoClient%E4%BD%BF%E7%94%A8%E5%B8%AE%E5%8A%A9/')
          }
        },
        {
          label: i18next.t('feedback'),
          click: function () {
            shell.openExternal('https://github.com/gaoyoubo/hexo-client/issues/new')
          }
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: i18next.t('settings'),
          accelerator: 'Cmd+,',
          enabled: true,
          click: function () {
            if (mainWindow) {
              mainWindow.webContents.send('settings')
            }
          }
        },
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

i18next
  .use(NodeFsBackend)
  .use(LanguageDetector)
  .init({
    debug: process.env.NODE_ENV === 'development',
    whitelist: ['en', 'zh'],
    nonExplicitWhitelist: true,
    lowerCaseLng: true,
    load: 'languageOnly',
    fallbackLng: ['en'],
    ns: ['common'],
    fallbackNS: 'common',
    backend: {
      loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      jsonIndent: 2
    }
  })

const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', function () {
    i18next.on('loaded', () => {
      createWindow()
      createMenu()
    })
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

export default i18next
