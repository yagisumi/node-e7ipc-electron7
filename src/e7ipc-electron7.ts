import { Handler, Server, Client } from '@yagisumi/e7ipc-types'
export * from '@yagisumi/e7ipc-types'
import { IpcMain, IpcRenderer } from 'electron'

class IpcRendererClient<Req, Res> implements Client<Req, Res> {
  private channel: string
  private ipcRenderer: Electron.IpcRenderer

  constructor(ipcRenderer: Electron.IpcRenderer, channel: string) {
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
  constructor(ipcMain: Electron.IpcMain, channel: string) {
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

export function createClient<Req, Res>(ipcRenderer: Electron.IpcRenderer, channel: string) {
  return new IpcRendererClient<Req, Res>(ipcRenderer, channel)
}

export function createServer<Req, Res>(ipcMain: Electron.IpcMain, channel: string) {
  return new IpcMainServer<Req, Res>(ipcMain, channel)
}
