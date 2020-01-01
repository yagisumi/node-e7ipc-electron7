import { Handler, Server, Client } from '@yagisumi/e7ipc-types'
export * from '@yagisumi/e7ipc-types'
import { IpcMain, IpcRenderer } from 'electron'

class IpcRendererClient<Req, Res> implements Client<Req, Res> {
  private channel: string
  private ipcRenderer: Electron.IpcRenderer

  constructor(channel: string, ipcRenderer: Electron.IpcRenderer) {
    this.ipcRenderer = ipcRenderer
    this.channel = channel
  }

  invoke(req: Req): Promise<Res> {
    return this.ipcRenderer.invoke(this.channel, req)
  }
}

class IpcMainServer<Req, Res> implements Server<Req, Res> {
  private channel: string
  private ipcMain: Electron.IpcMain
  constructor(channel: string, ipcMain: Electron.IpcMain) {
    this.ipcMain = ipcMain
    this.channel = channel
  }

  handle(listner: Handler<Req, Res>) {
    this.ipcMain.handle(this.channel, listner)
  }

  handleOnce(listner: Handler<Req, Res>) {
    this.handle((ev, req) => {
      this.removeHandler()
      return listner(ev, req)
    })
  }

  removeHandler() {
    this.ipcMain.removeHandler(this.channel)
  }
}

export function createClient<Req, Res>(channel: string, ipcRenderer: Electron.IpcRenderer) {
  return new IpcRendererClient<Req, Res>(channel, ipcRenderer)
}

export function createServer<Req, Res>(channel: string, ipcMain: Electron.IpcMain) {
  return new IpcMainServer<Req, Res>(channel, ipcMain)
}
