import Datastore from 'nedb'
import path from 'path'

const HOME_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const DB_PATH = `${path.resolve(HOME_PATH, '.hexo-client/db')}`

export default new Datastore({
  autoload: true,
  filename: DB_PATH
})
