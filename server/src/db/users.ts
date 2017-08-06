import mongoose = require("mongoose")
import bcrypt = require("bcryptjs")
import _ = require("lodash")

const UserSchema = new mongoose.Schema({
  username: {type: String, index: true, unique: true},
  password: String,
  admin: Boolean,
  created: Date
})

const User = mongoose.model("User", UserSchema)

export const UserDB = {
  addUser(username: string, password: string, admin: boolean = false): Promise<void> {
    return bcrypt.hash(password, 10)
      .then(hash => new User({
          username: username,
          password: hash,
          admin: admin,
          created: Date.now()
        }).save()
      )
      .then(() => {})
  },

  deleteUser(username: string): Promise<void> {
    return User.findOneAndRemove({username: username}).then(() => {})
  },

  renameUser(oldName: string, newName: string): Promise<void> {
    return User.findOneAndUpdate({username: oldName}, {$set: {username: newName}})
      .then(() => {})
  },

  changePassword(username: string, newPassword: string): Promise<void> {
    return bcrypt.hash(newPassword, 10)
      .then(hash => User.findOneAndUpdate(
        {username: username},
        {$set: {password: hash}}
      ))
      .then(() => {})
  },

  setAdmin(username: string, admin: boolean): Promise<void> {
    return User.findOneAndUpdate({username: username}, {$set: {admin: admin}})
      .then(() => {})
  },

  checkLogin(username: string, password: string): Promise<boolean> {
    return User.findOne({username: username})
      .then(user => user === null
          ? false
          : bcrypt.compare(password, (<any> user).password))
  },

  list() {
    return User.find()
      .then(users => _.map(users, u => _.pick(u, "username", "admin", "created")))
  }
}
