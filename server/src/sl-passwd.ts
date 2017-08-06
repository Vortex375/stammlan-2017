import minimist = require("minimist")

import * as db from "./db/setup"
import { UserDB } from "./db/users"

const argv = minimist(process.argv.slice(2), {
  alias: {
    "add": "a",
    "delete": "d",
    "rename": "r",
    "check": "c",
    "list": "l"
  },
  boolean: true
})

db.setup()
  .then(() => main())
  .then(() => console.log("done."))
  .catch(err => console.log("failed:", err))
  .then(() => db.close())

function main(): Promise<any> {
    if (argv.add && argv._.length === 2) {
      console.log("Adding new user ...")

      return UserDB.addUser(argv._[0], argv._[1], !!argv.admin)

    } else if (argv.check && argv._.length === 2) {
      console.log("Checking login ...")

      return UserDB.checkLogin(argv._[0], argv._[1])
        .then(result => console.log("result:", result))

    } else if (argv.delete && argv._.length === 1) {
      console.log("Deleting user ...")

      return UserDB.deleteUser(argv._[0])

    } else if (argv.rename && argv._.length === 2) {
      console.log("Renaming user ...")

      return UserDB.renameUser(argv._[0], argv._[1])

    } else if (argv.admin !== undefined && argv._.length === 1) {
     console.log("Setting admin status ...")

     return UserDB.setAdmin(argv._[0], argv.admin)

   } else if (argv.list) {

     return UserDB.list()
      .then(result => console.log(result))

   } else if (argv._.length === 2) {
     console.log("Changing password ...")

     return UserDB.changePassword(argv._[0], argv._[1])

   } else {
     return Promise.reject("Invalid command")
  }
}
