let handler = async (m, { usedPrefix }) => {
  const nombreBot = global.namebot
  const custom = Object.keys(global.db?.data?.customCommands || {})

  const text = [
    ` === 𝙈𝙀𝙉𝙐 ===`,
    ``,
    `Bot: ${nombreBot}`,
    ``,
    `-- 🄲🄾🄼🄰🄽🄳🄾🅂 🄳🄸🅂🄿🄾🄽🄸🄱🄻🄴🅂 --\n`,
    ...(custom.length ? custom.map(cmd => `${usedPrefix}${cmd}\n`) : ['(ninguno)']),
  ].join('\n')

  await m.reply(text)
}

handler.command = ['menu', 'help', 'menú']
export default handler
