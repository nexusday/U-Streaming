import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51957715814', 'Drako', true],
]


global.ownerLid = [
  ['77206885785728', 'Drako', true],
]

global.sessions = 'Sessions'
global.bot = 'Serbot' 
global.AFBots = true

global.packname = ''
global.namebot = '𝐋𝐀 𝐃𝐑𝐀𝐊𝐎 𝐒𝐇𝐎𝐏'
global.author = 'Drako'
global.moneda = ''


global.canal = ''

global.ch = {
ch1: '',
}

global.mods =   []
global.prems = []

global.multiplier = 69 
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
