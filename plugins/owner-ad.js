import fs from 'fs'
import path from 'path'

const imgDir = path.join('storage', 'databases', 'img')
const pluginsDir = path.join('plugins')

const getMsgText = (msg) => {
  if (!msg) return ''
  return (
    (msg.text || '').trim() ||
    (msg.caption || '').trim() ||
    (msg.message?.extendedTextMessage?.text || '').trim() ||
    (msg.message?.imageMessage?.caption || '').trim() ||
    (msg.message?.videoMessage?.caption || '').trim() ||
    ''
  )
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply('*[❗] Solo los dueños pueden usar este comando.*')

  const nameArg = (args[0] || '').toLowerCase().replace(/[^a-z0-9_-]/g, '')
  if (!nameArg) {
    return m.reply(
      `Usa: ${usedPrefix}${command} <nombre_comando> <texto>\n` +
      `Ejemplo: ${usedPrefix}${command} yape\n` +
      `(Debes responder a un mensaje).`
    )
  }

  const commandText =
    getMsgText(m.quoted) ||
    args.slice(1).join(' ').trim() ||
    getMsgText(m) ||
    ''

  const pluginPath = path.join(pluginsDir, `${nameArg}-ad.js`)
  if (fs.existsSync(pluginPath)) {
    return m.reply(`Ya existe el comando /${nameArg}.`)
  }

  let imagePath = null
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (/image/.test(mime)) {
    const buffer = await q.download()
    if (buffer) {
      fs.mkdirSync(imgDir, { recursive: true })
      imagePath = path.join(imgDir, `${nameArg}.png`)
      fs.writeFileSync(imagePath, buffer)
    }
  }

  const pluginCode = `
import fs from 'fs'

let handler = async (m, { conn }) => {
  const text = ${JSON.stringify(commandText)}
  const imagePath = ${imagePath ? JSON.stringify(imagePath) : 'null'}

  if (imagePath && fs.existsSync(imagePath)) {
    return conn.sendFile(m.chat, imagePath, '${nameArg}.png', text || undefined, m)
  }
  if (text) return m.reply(text)
}

handler.command = ['${nameArg}']
handler.tags = ['custom']
handler.help = ['${nameArg}']

export default handler
`.trimStart()

  fs.mkdirSync(pluginsDir, { recursive: true })
  fs.writeFileSync(pluginPath, pluginCode, 'utf-8')

  global.db.data.customCommands ||= {}
  global.db.data.customCommands[nameArg] = {
    text: commandText,
    image: imagePath
  }
  await global.db.write()

  return m.reply(`Comando /${nameArg} creado.\nTexto: ${commandText || '(vacío)'}\nImagen: ${imagePath ? 'guardada' : 'no'}`)
}

handler.command = ['ad']
handler.owner = true
handler.rowner = true

export default handler
