'use strict'

import Mygraphql from './mygraphql'

export default class Database {
  public gr: any

  constructor() {
    this.gr = new Mygraphql()
  }
  public createEvent(sessionId: String, content: String) {
    let timestamp = Date.now()
    let mutation = `
    mutation {
      createEvent(input: {
        eventId: "${timestamp}"
        sessionId: "${sessionId}",
        content: "${content}"
      }){
        eventId
      }
    }`
    return this.gr.mutate(mutation).then(res => {
      return res.data.createEvent.eventId
    })
  }
  public createSession(fileId: String) {
    let timestamp = Date.now()
    let mutation = `
    mutation {
      createSession(input: {
        sessionId: "${timestamp}"
        fileId: "${fileId}"
      }){
        sessionId
      }
    }
    `
    return this.gr.mutate(mutation).then(res => {
      return res.data.createSession.sessionId
    })
  }
  public createFile(path: String) {
    let timestamp = Date.now()
    let mutation = `
    mutation {
      createFile(input: {
        fileId: "${timestamp}"
        path: "${path}"
      }){
        fileId
      }
    }
    `
    return this.gr.mutate(mutation).then(res => {
      return res.data.createFile.fileId
    })
  }
  public listFilesByPath(path: String) {
    let qr = `
    query {
      listFilesByPath(path: "${path}") {
        items {
          fileId
        }
      }
    }
    `
    return this.gr.query(qr).then(res => {
      return res.data.listFilesByPath.items
    })
  }
  public findFileId(path: String) {
    // find a file and return its id or create a new one
    return this.listFilesByPath(path).then(items => {
      if (items.length >= 1) {
        // file found; return its fileId
        return items[0].fileId
      } else {
        // file not found; create a new file entry and return its id
        return this.createFile(path).then(fileId => {
          return fileId
        })
      }
    })
  }
}
