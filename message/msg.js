"use strict";
process.on('uncaughtException', console.error)
const { downloadContentFromMessage, downloadMediaMessage } = require("@adiwajshing/baileys");
const { color, bgcolor } = require("../lib/color");
const fetch = require("node-fetch");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn, execSync } = require("child_process");
let setting;
const { ownerNumber, MAX_TOKEN, OPENAI_KEY } = setting = require('../config.json');
const speed = require("performance-now");
const ffmpeg = require("fluent-ffmpeg");
let { ytmp4, ytmp3, ytplay, ytplayvid } = require('../lib/youtube')
const { mediafireDl, getGroupAdmins } = require('../lib/myfunc')
const axios = require("axios");
const cheerio = require("cheerio");
moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async (conn, msg, m, openai) => {
  try {
    //if (msg.key.fromMe) return
    const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg;
    const toJSON = (j) => JSON.stringify(j, null, "\t");
    const from = msg.key.remoteJid;
    const chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
    const args = chats.split(" ");
    const args22 = chats.trim().split(/ +/).slice(1)
    const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#%^&./\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓=|~+×_*!#,|÷?;:%^&./\\©^]/gi) : null;
    const command = prefix ? chats.slice(1).trim().split(' ').shift().toLowerCase() : ''
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    const groupMetadata = msg.isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = msg.isGroup ? groupMetadata.subject : ''
    const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
    const userId = sender.split("@")[0]
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const isOwner = [botNumber,...ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)
    const pushname = msg.pushName;
    const q = chats.slice(command.length + 1, chats.length);
    const textoo = args22.join(" ")
    const isCmd = chats.startsWith(prefix)
    const content = JSON.stringify(msg.message)
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isAudio = (type == 'audioMessage')
    const isSticker = (type == 'stickerMessage')
    const isDocument = (type == 'documentMessage')
    const isLocation = (type == 'locationMessage')
    const isViewOnce = (type == 'viewOnceMessageV2')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
    const textolink = decodeURIComponent(chats.replace(command, '').replace(prefix, '').split(' ').join(''))
    const textosinespacio = decodeURIComponent(chats.replace(command, '').replace(prefix, ''))
    const participants = msg.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = msg.isGroup ? await getGroupAdmins(participants) : ''
    const isAdmin = msg.isGroup ? groupAdmins.includes(sender) : false
    let senderJid;
    if (msg.isGroup) {
    senderJid = msg.key.participant;
    } else {
    senderJid = msg.sender;}

/* Baneo de chats */

try {
let banned = global.db.data.chats[from].mute
if (banned && !chats.includes('unmute')) return
} catch {
}

/* Envios de mensajes */

const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: msg });
};
const tempButton = async (remoteJid, text, footer, content) => {
const templateMessage = { viewOnceMessage: { message: { templateMessage: { hydratedTemplate: { hydratedContentText: text, hydratedContentFooter: footer, hydratedButtons: content, }, }, }, }, };
const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {});
};
const sendAud = (link) => {
conn.sendMessage(from, { audio: { url: link }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
};
const sendVid = (link, thumbnail) => {
conn.sendMessage( from, { video: { url: link }, fileName: `error.mp4`, thumbnail: thumbnail, mimetype: 'video/mp4' }, { quoted: msg });
};
const sendImgUrl = (link) => {
conn.sendMessage( from, { image: { url: link }, fileName: `error.jpg` }, { quoted: msg });
};

/* Auto Read & Presence Online */
conn.readMessages([msg.key]);
conn.sendPresenceUpdate("available", from);

    // Logs;
    if (!isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), ":", chats);
    }
    if (isGroup && isCmd && !fromMe) {
      console.log("->[\x1b[1;32mCMD\x1b[1;37m]", color(moment(msg.messageTimestamp * 1000).format("DD/MM/YYYY HH:mm:ss"), "yellow"), color(`${command} [${args.length}]`), "DE", color(pushname), "in", color(groupName), ":", chats);
    }

    switch (command) {
      case 'start': case 'menu':
      var textReply = `مرحبًا @${senderJid.split`@`[0] || pushname || 'user'} 👋

      أنا بوت واتساب يستخدم الذكاء الاصطناعي لـ OpenAI (ChatGPT)، تم إنشائي للإجابة على أسئلتك. أرسل لي سؤالًا وسأجيب عليك!

      _البوت محدود بالرد على ${MAX_TOKEN} كلمة كحد أقصى_

      <------------------------------------------->

      *الأوامر المتاحة*

      🔷 *العامة*
      \`\`\`- ${prefix}menu
      - ${prefix}mute
      - ${prefix}unmute
      - ${prefix}ping
      - ${prefix}runtime\`\`\`

      🤖 *AI*
      \`\`\`- ${prefix}chatgpt
      - ${prefix}chatgpt2
      - ${prefix}delchatgpt
      - ${prefix}dall-e\`\`\`

      📥 *الوسائط*
      \`\`\`- ${prefix}play
      - ${prefix}play2
      - ${prefix}ytmp3
      - ${prefix}ytmp4
      - ${prefix}sticker
      - ${prefix}mediafiredl\`\`\`

      💫 *المجموعات*
      \`\`\`- ${prefix}hidetag\`\`\`

      🤴🏻 *Owner*
      \`\`\`- ${prefix}update
      - ${prefix}desactivarwa\`\`\`

      *Edited By @212679713244*`
if (msg.isGroup) {
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: msg });
} else {
let fkontak2 = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${senderJid.split('@')[0]}:${senderJid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
conn.sendMessage(from, { text: textReply, mentions: [...textReply.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: fkontak2 });
}
break
case 'runtime':
conn.sendMessage(from, { text: `*${require('../lib/myfunc').runtime(process.uptime())}*` }, { quoted: msg });
break
case 'hidetag':
if (!msg.isGroup) return conn.sendMessage(from, { text: `*[❗] هذا الأمر يمكن استخدامه فقط في المجموعات*` }, { quoted: msg })
if (!isAdmin) return conn.sendMessage(from, { text: `*[❗] هذا الأمر يمكن استخدامه فقط من قبل مشرفي المجموعة*` }, { quoted: msg })
try {
let users = participants.map(u => u.id).filter(id => id);
let htextos = `${textoo ? textoo : ''}`
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`)
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
conn.sendMessage(from, { image: mediax, mentions: users, caption: htextos, mentions: users }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
} else if (isVideo || isQuotedVideo) {
await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${senderJid.split("@")[0]}.mp4`)
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp4`)
conn.sendMessage(from, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp4`)
} else if (isAudio || isQuotedAudio) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.mp3`)
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.mp3`)
conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `Hidetag.mp3` }, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.mp3`)
} else if (isSticker || isQuotedSticker) {
await conn.downloadAndSaveMediaMessage(msg, 'image', `./tmp/${senderJid.split("@")[0]}.jpg`)
var mediax = await fs.readFileSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
conn.sendMessage(from, {sticker: mediax, mentions: users}, { quoted: msg })
fs.unlinkSync(`./tmp/${senderJid.split("@")[0]}.jpg`)
} else {
await conn.sendMessage(from, { text : `${htextos}`, mentions: users }, { quoted: msg })}
} catch {
conn.sendMessage(from, { text: `*[❗] لاستخدام هذا الأمر، يجب إضافة نص أو الرد على صورة أو فيديو*` }, { quoted: msg })}
break
case 'ping':
var timestamp = speed();
var latensi = speed() - timestamp
conn.sendMessage(from, { text: `*زمن الاستجابة: ${latensi.toFixed(4)}s*` }, { quoted: msg });
break
case 'mute': case 'banchat':
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `*[❗] هذا الأمر يمكن استخدامه فقط من قبل مشرفي المجموعة*` }, { quoted: msg });
if (global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `*[❗] هذه الدردشة مكتومة بالفعل من قبل*` }, { quoted: msg });
global.db.data.chats[from].mute = true
conn.sendMessage(from, { text: `*[❗]  تم كتم هذه الدردشة بنجاح، لن يرد البوت على أي رسالة حتى يتم إلغاء الكتم عنها باستخدام الأمر ${prefix}unmute*` }, { quoted: msg });
break
case 'unmute': case 'unbanchat':
if (isGroup && !isAdmin) return conn.sendMessage(from, { text: `*[❗] هذا الأمر يمكن استخدامه فقط من قبل مشرفي المجموعة*` }, { quoted: msg });
if (!global.db.data.chats[from].mute) return conn.sendMessage(from, { text: `*[❗] هذه الدردشة غير مكتومة*` }, { quoted: msg });
global.db.data.chats[from].mute = false
conn.sendMessage(from, { text: `*[❗] تم إلغاء كتم هذه الدردشة بنجاح، الآن سيرد البوت على الرسائل بشكل طبيعي*` }, { quoted: msg });
break
case 'play':
if (!textoo) return conn.sendMessage(from, { text: `*[❗] *[❗] اسم الأغنية مفقود، يرجى إدخال الأمر بالاسم أو العنوان أو رابط أي أغنية أو فيديو على YouTube*\n\n*—◉ مثال:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*` }, { quoted: msg });
let res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=BrunoSobrino&query=${textoo}`)
let json = await res.json()
let kingcore = await ytplay(textoo)
let audiodownload = json.result.audio
if (!audiodownload) audiodownload = kingcore.result
await conn.sendMessage(from, { audio: { url: `${audiodownload}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
break
case 'play2':
if (!textoo) return conn.sendMessage(from, { text: `*[❗] [❗] اسم الأغنية مفقود، يرجى إدخال الأمر بالإضافة إلى اسم الأغنية أو العنوان أو رابط أي أغنية أو فيديو من YouTube*\n\n*—◉ مثال:*\n*◉ ${prefix + command} Good Feeling - Flo Rida*` }, { quoted: msg });
let mediaa = await ytplayvid(textoo)
await conn.sendMessage(from, { video: { url: mediaa.result }, fileName: `error.mp4`, thumbnail: mediaa.thumb, mimetype: 'video/mp4' }, { quoted: msg });
break
case 'ytmp3':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] يرجى إدخال رابط فيديو من YouTube*\n\n*—◉ مثال:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc` }, { quoted: msg });
let ress22 = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=BrunoSobrino&url=${textolink}`)
let jsonn22 = await ress22.json()
let kingcoreee2 = await ytmp3(textolink)
let audiodownloaddd2 = jsonn22.result.link
if (!audiodownloaddd2) audiodownloaddd2 = kingcoreee2.result
await conn.sendMessage(from, { audio: { url: `${audiodownloaddd2}` }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: msg });
break
case 'ytmp4':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] يرجى إدخال رابط فيديو من YouTube*\n\n*—◉ مثال:*\n*◉ ${prefix + command}* https://youtu.be/WEdvakuztPc` }, { quoted: msg });
let ress2 = await fetch(`https://api.lolhuman.xyz/api/ytvideo?apikey=BrunoSobrino&url=${textolink}`)
let jsonn2 = await ress2.json()
let kingcoreee = await ytmp4(textolink)
let videodownloaddd = jsonn2.result.link.link
if (!videodownloaddd) videodownloaddd = kingcoreee.result
await conn.sendMessage(from, { video: { url: videodownloaddd }, fileName: `error.mp4`, thumbnail: `${kingcoreee.thumb || ''}`, mimetype: 'video/mp4' }, { quoted: msg });
break
case 'dall-e': case 'draw':
if (!textoo) return conn.sendMessage(from, { text: `*[❗]  موضوع الصورة لاستخدام وظيفة Dall-E الذكية\n\n*—◉ أمثلة على الطلبات:*\n*◉ ${prefix + command} draw a amazigh woman*\n*◉ ${prefix + command} Potato Robot*` }, { quoted: msg });
try {
const responsee = await openai.createImage({ prompt: textoo, n: 1, size: "512x512", });
conn.sendMessage(from, { image: { url: responsee.data.data[0].url }, fileName: `error.jpg` }, { quoted: msg });
} catch (jj) {
try {
conn.sendMessage(from, { image: { url: `https://api.lolhuman.xyz/api/dall-e?apikey=BrunoSobrino&text=${textoo}` }, fileName: `error.jpg` }, { quoted: msg });
} catch (jj2) {
conn.sendMessage(from, { text: "*[❗] حدث خطأ، لم يتم الحصول على أي صورة من Dall-E الذكية...\n\n*—◉ الخطأ:*\n" + jj2 }, { quoted: msg });
}}
break
case 'update':
if (!isOwner) return conn.sendMessage(from, { text: `*[❗] هذا الأمر يمكن استخدامه فقط من قبل مالك البوت*` }, { quoted: msg });
try {
let stdout = execSync('git pull' + (m.fromMe && q ? ' ' + q : ''))
await conn.sendMessage(from, { text: stdout.toString() }, { quoted: msg });
} catch {
let updatee = execSync('git remote set-url origin https://github.com/BrunoSobrino/openai-botwa.git && git pull')
await conn.sendMessage(from, { text: updatee.toString() }, { quoted: msg })}
break
case 'desactivarwa':
if (!isOwner) return conn.sendMessage(from, { text: `*[❗]  فقط من قبل مالك البوت*` }, { quoted: msg });
if (!q || !args[1] || !textoo) return conn.sendMessage(from, { text: `*[❗]  يرجى إدخال رقم، على سبيل المثال ${prefix + command} +1 (450) 999-999*` }, { quoted: msg });
let ntah = await axios.get("https://www.whatsapp.com/contact/noclient/")
let email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=10")
let cookie = ntah.headers["set-cookie"].join("; ")
let $ = cheerio.load(ntah.data)
let $form = $("form");
let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
let form = new URLSearchParams()
form.append("jazoest", $form.find("input[name=jazoest]").val())
form.append("lsd", $form.find("input[name=lsd]").val())
form.append("step", "submit")
form.append("country_selector", "ID")
form.append("phone_number", q)
form.append("email", email.data[0])
form.append("email_confirm", email.data[0])
form.append("platform", "ANDROID")
form.append("your_message", "Perdido/roubado: desative minha conta")
form.append("__user", "0")
form.append("__a", "1")
form.append("__csr", "")
form.append("__req", "8")
form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
form.append("dpr", "1")
form.append("__ccg", "UNKNOWN")
form.append("__rev", "1006630858")
form.append("__comment_req", "0")
let ressss = await axios({ url, method: "POST", data: form, headers: { cookie } })
var payload = String(ressss.data)
if (payload.includes(`"payload":true`)) {
conn.sendMessage(from, { text: `##- WhatsApp Support -##\n\nمرحبًا،\n\nشكرًا لرسالتك.\n\nلقد قمنا بتعطيل حسابك على واتساب. هذا يعني أن حسابك معطل مؤقتًا وسيتم حذفه تلقائيًا بعد 30 يومًا إذا لم تسجل حسابك مرة أخرى. يرجى ملاحظة: لا يمكن لفريق خدمة العملاء في واتساب حذف حسابك يدويًا.\n\nخلال فترة الإغلاق:\n • من الممكن أن يرى جهات الاتصال الخاصة بك في واتساب اسمك وصورتك الشخصية.\n • سيظل أي رسالة يمكن أن يرسلها جهات اتصالك إلى الحساب في حالة انتظار لمدة تصل إلى 30 يومًا.\n\nإذا كنت ترغب في استعادة حسابك، يرجى إعادة تسجيل حسابك في أقرب وقت ممكن.\nيرجى إعادة تسجيل حسابك عن طريق إدخال الرمز المؤلف من 6 أرقام، الرمز الذي تتلقاه عبر الرسائل القصيرة أو المكالمات الهاتفية. إذا قمت بإعادة تسجيل حسابك\n\nإذا كان لديك أي أسئلة أو مخاوف أخرى، يرجى عدم التردد في الاتصال بنا. سنكون سعداء للمساعدة!` }, { quoted: msg });
} else if (payload.includes(`"payload":false`)) {
conn.sendMessage(from, { text: `##- دعم واتساب -##\n\nمرحبا:\n\nشكرا لرسالتك.\n\nلمتابعة طلبك، نحتاج إلى التحقق من أن هذا الرقم الذي قمت بإرسال رسالتك منه هو رقم هاتفك. الرجاء إرسالنا وثيقة تثبت أن الرقم هو ملكي، مثل نسخة من فاتورة الهاتف أو عقد الخدمة.\n\nيرجى التأكد من إدخال رقم الهاتف الخاص بك في صيغة دولية كاملة. لمزيد من المعلومات حول الصيغة الدولية، يرجى الاطلاع على هذه المقالة.\n\nإذا كان لديك أي أسئلة أو استفسارات أخرى، فلا تتردد في الاتصال بنا. سنكون سعداء بمساعدتك.` }, { quoted: msg });
} else conn.sendMessage(from, { text: util.format(JSON.parse(res.data.replace("for (;;);", ""))) }, { quoted: msg });
break
case 'mediafiredl':
if (!textolink) return conn.sendMessage(from, { text: `*[❗] أدخل رابط ميديافاير صالحًا ، مثال: ${prefix}mediafiredl* https://www.mediafire.com/file/r0lrc9ir5j3e2fs/DOOM_v13_UNCLONE` }, { quoted: msg });
let resss2 = await mediafireDl(textolink)
let caption = `*📓 رقم:* ${resss2.name}\n*📁 الحجم:* ${resss2.size}\n*📄 Tipo:* ${resss2.mime}\n\n*⏳ انتظر حتى أرسل ملفك. . . .*`.trim()
await conn.sendMessage(from, { text: caption }, { quoted: msg });
await conn.sendMessage(from, { document : { url: resss2.link }, fileName: resss2.name, mimetype: resss2.mime.toUpperCase() }, { quoted: msg })
break
/*-------------------------------------------------------*/
/* [❗]                      [❗]                      [❗] */
/*                                                       */
/*       |- [ ⚠ ] - CREDITOS DEL CODIGO - [ ⚠ ] -|      */
/*     —◉ DESAROLLADO POR OTOSAKA:                       */
/*     ◉ Otosaka (https://github.com/6otosaka9)          */
/*     ◉ Número: wa.me/51993966345                       */
/*                                                       */
/*     —◉ FT:                                            */
/*     ◉ BrunoSobrino (https://github.com/BrunoSobrino)  */
/*                                                       */
/* [❗]                      [❗]                      [❗] */
/*-------------------------------------------------------*/
case 'chatgpt': case 'ia':
if (!textoo) return conn.sendMessage(from, { text: `*[❗] أدخل طلبًا أو طلبًا لاستخدام ميزة ChatGPT*\n\n*—◉ أمثلة على الطلبات والأوامر:*\n*◉ ${prefix + command} اكتب موضوع حول الدكاء الاصطناعي*\n*◉ ${prefix + command} كود JS للعبة الورق*` }, { quoted: msg });
try {
let chgptdb = global.chatgpt.data.users[senderJid];
chgptdb.push({ role: 'user', content: textoo });
const config = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'You will be an automated chatbot designed to operate on WhatsApp, a popular messaging platform. Your primary language of communication will be Arabic, allowing you to assist users who speak this language. Your name, which will be displayed on the app, is 🔰 AL-Potato 🔰. You were created by 🔥L3FiiiT🔥, the person responsible for programming you and making sure you function properly' }, ...chgptdb ]})}
let response = await axios(config);
chgptdb.push({ role: 'assistant', content: response.data.choices[0].message.content })
conn.sendMessage(from, { text: `${response.data.choices[0].message.content}`.trim() }, { quoted: msg });
} catch (efe1) {
try {
let IA = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)
let IAR = await IA.json()
conn.sendMessage(from, { text: `${IAR.response}`.trim() }, { quoted: msg });
} catch {
try {
const BotIA222 = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
conn.sendMessage(from, { text: BotIA222.data.choices[0].text.trim() }, { quoted: msg });
} catch (efe2) {
try {
let Rrres = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let Jjjson = await Rrres.json()
conn.sendMessage(from, { text: Jjjson.data.data.trim() }, { quoted: msg });
} catch (efe3) {
try {
let tioress22 = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=${senderJid}`)
let hasill22 = await tioress22.json()
conn.sendMessage(from, { text: `${hasill22.result}`.trim() }, { quoted: msg });
} catch (efe4) {
console.log(efe4)}}}}}
break
case 'delchatgpt':
try {
delete global.chatgpt.data.users[senderJid]
conn.sendMessage(from, { text: `*[❗] تم حذف سجل الرسائل بينك وبين ChatGPT (IA) بنجاح*\n\n*—◉ تذكر أنه يمكنك استخدام هذا الأمر عند حدوث أي خطأ في الأمر ${prefix}chatgpt O ${prefix}ia*` }, { quoted: msg });
} catch (error1) {
console.log(error1)
conn.sendMessage(from, { text: `*[❗] [❗] خطأ، يرجى المحاولة مرة أخرى*` }, { quoted: msg });
}
break
case 'chatgpt2': case 'ia2':
if (!textoo) return reply(`*[❗] [❗] يرجى إدخال طلب أو أمر لاستخدام وظيفة ChatGPT*\n\n*—◉ أمثلة على الطلبات أو الأوامر:*\n*◉ ${prefix + command} تأملات حول مسلسل Merlina 2022 على نيتفليكس*\n*◉ ${prefix + command} رمز JS للعبة ورق**`)
try {
let IA2 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${textoo}&string_id=${senderJid}`)
let IAR2 = await IA2.json()
reply(`${IAR2.response}`.trim())
} catch {
try {
const BotIA = await openai.createCompletion({ model: "text-davinci-003", prompt: textoo, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(BotIA.data.choices[0].text.trim())
} catch (qe) {
try {
let rrEes = await fetch(`https://api.ibeng.tech/api/info/openai?text=${textoo}&apikey=tamvan`)
let jjJson = await rrEes.json()
reply(jjJson.data.data.trim())
} catch (qe4) {
try {
let tioress = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${textoo}&user=user-unique-id`)
let hasill = await tioress.json()
reply(`${hasill.result}`.trim())
} catch (qqe) {
reply("*[❗] خطأ، لم يتم الحصول على إجابات من الذكاء الاصطناعي...\n\n*—◉ الخطأ:*\n" + qqe)
}}}}
break
case 'sticker': case 's':
try {
const pname = 'OpenAI - WaBot'
const athor = '+' + conn.user.id.split(":")[0];
if (isImage || isQuotedImage) {
await conn.downloadAndSaveMediaMessage(msg, "image", `./tmp/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./tmp/${sender.split("@")[0]}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(`./tmp/${sender.split("@")[0]}.jpeg`)
} else {
if(isVideo || isQuotedVideo) {
var media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./tmp/${sender}.jpeg`)
var opt = { packname: pname, author: athor }
conn.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, {});
let filenameJpg = "stk.jpg";
fs.writeFileSync(filenameJpg, imageBuffer);
await ffmpeg('./' + filenameJpg).input(filenameJpg).on('start', function(cmd){
console.log(`Started: ${cmd}`)
}).on('error', function(err) {
console.log(`Error: ${err}`);
reply('error')}).on('end', async function() {
console.log('Finish')
await conn.sendMessage(from, { sticker: { url:'stk.webp' }})
}).addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`]).toFormat('webp').save('stk.webp');
}}} catch {
reply(`*[❗] قم بالرد على صورة أو gif أو مقطع فيديو ، والذي سيتم تحويله إلى ملصق ، تذكر أنه يجب عليك إرسال صورة أو الرد على صورة بالأمر ${prefix + command}*`)
}
break
default:
const botNumber22 = '@' + conn.user.id.split(":")[0];
if (msg.key.fromMe || msg.sender == conn.user.id) return //console.log('[❗] Unicamente respondo mensajes sin comandos de otros usuarios pero no se mi mismo')
if (!chats.startsWith(botNumber22) && isGroup) return
if (isImage || isVideo || isSticker || isViewOnce || isAudio || isDocument || isLocation) return
let chatstext = chats.replace(conn.user.id.split(":")[0].split("@")[0], '')
const lines = chatstext.split('\n');
lines[0] = lines[0].replace('@', '').replace(prefix, '').replace(/^\s+|\s+$/g, '');
const resultLines = lines.join('\n');
if (isGroup) chatstext = resultLines //chatstext.replace("@", '').replace(prefix, '')
console.log("->[\x1b[1;32mNew\x1b[1;37m]", color('Pregunta De', 'yellow'), color(pushname, 'lightblue'), `: "${chatstext}"`)
conn.sendPresenceUpdate("composing", from);
try {
let chgptTdb = global.chatgpt.data.users[senderJid];
chgptTdb.push({ role: 'user', content: chatstext });
const conNfig = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + OPENAI_KEY }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: 'You will be an automated chatbot designed to operate on WhatsApp, a popular messaging platform. Your primary language of communication will be Arabic, allowing you to assist users who speak this language. Your name, which will be displayed on the app, is 🔰 AL-Potato 🔰. You were created by 🔥L3FiiiT🔥, the person responsible for programming you and making sure you function properly' }, ...chgptTdb ]})}
let responNse = await axios(conNfig);
chgptTdb.push({ role: 'assistant', content: responNse.data.choices[0].message.content })
reply(responNse.data.choices[0].message.content)
} catch {
try {
let IA3 = await fetch(`https://api.amosayomide05.cf/gpt/?question=${chatstext}&string_id=${senderJid}`)
let IAR3 = await IA3.json()
reply(`${IAR3.response}`.trim())
} catch {
try {
const response = await openai.createCompletion({ model: "text-davinci-003", prompt: chatstext, temperature: 0.3, max_tokens: MAX_TOKEN, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
reply(response.data.choices[0].text.trim())
} catch (eee1) {
try {
let rresSS = await fetch(`https://api.ibeng.tech/api/info/openai?text=${chatstext}&apikey=tamvan`)
let jjsonNN = await rresSS.json()
reply(jjsonNN.data.data.trim())
} catch (eee) {
try {
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=BrunoSobrino&text=${chatstext}&user=user-unique-id`)
let hasil = await tiores.json()
reply(`${hasil.result}`.trim())
} catch (eeee) {
reply("*[❗] خطأ ، لم أتلق أي ردود من الدكاء الاصطناعي ...*\n\n*—◉ خطاء:*\n" + eeee)  
}}}}}
break
}} catch (err) {
console.log(color("[ERROR]", "red"), err); }};
