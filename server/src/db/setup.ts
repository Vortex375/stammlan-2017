import mongoose = require("mongoose")
mongoose.Promise = global.Promise
const db = mongoose.connection

export function setup(url = "mongodb://localhost/test"): Promise<void> {
  mongoose.connect(url, {useMongoClient: true})

  return new Promise<void>((resolve, reject) => {
    db.on("error", (err) => reject(err))
    db.once("open", () => resolve())
  })
}

export function close(): Promise<void> {
  return db.close()
}
