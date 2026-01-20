import fs from 'fs'
import path from 'path'

const imgDir = path.join('storage', 'databases', 'img')
const pluginsDir = path.join('plugins')

let handler = async (m, { args, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply('*[❗] Solo los dueños pueden usar este comando.*')

  const nameArg = (args[0] || '').toLowerCase().replace(/[^a-z0-9_-]/g, '')
  if (!nameArg) {
    return m.reply(`Usa: ${usedPrefix}${command} <nombre_comando>\nEjemplo: ${usedPrefix}${command} qr`)
  }

  const pluginPath = path.join(pluginsDir, `${nameArg}-ad.js`)
  const imagePath = path.join(imgDir, `${nameArg}.png`)

  let removed = false

  if (fs.existsSync(pluginPath)) {
    try { fs.unlinkSync(pluginPath); removed = true } catch {}
  }
  if (fs.existsSync(imagePath)) {
    try { fs.unlinkSync(imagePath); removed = true } catch {}
  }

  if (global.db?.data?.customCommands && global.db.data.customCommands[nameArg]) {
    delete global.db.data.customCommands[nameArg]
    await global.db.write()
    removed = true
  }

  if (!removed) {
    return m.reply(`No encontré el comando /${nameArg}.`)
  }

  return m.reply(`Comando /${nameArg} eliminado junto con sus datos.`)
}

handler.command = ['delad']
handler.owner = true
handler.rowner = true

export default handler
