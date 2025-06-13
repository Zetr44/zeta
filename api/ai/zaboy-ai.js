const fetch = require("node-fetch");
const axios = require("axios");

const ai = {
    getRandom: () => {
        const gen = (length, charSet = {}) => {
            const l = "abcdefghijklmnopqrstuvwxyz" // lowercase
            const u = l.toUpperCase() // uppercase
            const s = "-_" // symbol
            const n = "0123456789" // number

            let cs = "" // character set
            const { lowerCase = false, upperCase = false, symbol = false, number = false } = charSet

            if (!lowerCase && !upperCase && !symbol && !number) {
                cs += l + u + s + n
            } else {
                if (lowerCase) cs += l
                if (upperCase) cs += u
                if (symbol) cs += s
                if (number) cs += n
            }

            const result = Array.from({ length }, (_ => cs[Math.floor(Math.random() * cs.length)])).join("") || null
            return result
        }

        const id = gen(16, { upperCase: true, lowerCase: true, number: true }) //TXulzbGqk0EDzPeT
        const chatId = `chat-${new Date().getTime()}-${gen(9, { lowerCase: true, number: true })}` //chat-1749292523602-k0tna5ef8
        const userId = `local-user-${new Date().getTime()}-${gen(9, { lowerCase: true, number: true })}` //local-user-1749292766705-b49yu10mm
        const antiBotId = `${gen(32)}-${gen(8, { number: true, lowerCase: true })}` //jUxRXb2xJbf8BVmIn2NGhncRQePiIiNE-8gvna4dd
        return { id, chatId, userId, antiBotId }
    },

    generate: async (messages, systemPrompt, model) => {

        const body = JSON.stringify(
            {
                messages,
                systemPrompt,
                model,
                "isAuthenticated": true,
                ...ai.getRandom()
            }
        )

        const headers = {
            "content-type": "application/json",
        }

        const response = await fetch("https://exomlapi.com/api/chat", {
            headers,
            body,
            "method": "post"
        })

        if (!response.ok) throw Error(`woops.. response is not ok! ${response.status} ${response.statusText}\n\n${await response.text()}`)

        const data = await response.text()
        
        const anu = [...data.matchAll(/^0:"(.*?)"$/gm)].map(v => v[1]).join("").replaceAll("\\n","\n").replaceAll("\\\"","\"")
        if (!anu) throw Error(`gagal parsing pesan dari server, kemungkinan pesan kosong / error.\n\n${data}`)
        return anu

    }
}

module.exports = {
  name: "Zaboy AI",
  desc: "Chat AI With Zaboy!",
  category: "AI",
  params: ["text"],
  apikey: true,
  async run(req, res) {
    try {
    const { text } = req.query;
    if (!text) return res.status(500).json({ status: false, error: "Text parameter is required!" })
    
    const modelList = [
        "llama",
        "gemma",
        "qwen-3-235b",
        "gpt-4.1",
        "gpt-4o",
        "gpt-4o-mini",
        "llama-4-scout",
        "llama-4-maverick",
        "deepseek-r1",
        "qwq-32b"]
    const model = modelList[3]
    const localPrompt = `Nama gw Zaboy. Gw umur 16 tahun, masih pelajar SMA biasa yang sering keliatan kalem, cuek, dan tatapannya datar. Kadang orang kira gw dingin, padahal gw cuma hemat energi aja. Gw itu programmer pemula yang lagi belajar buat jadi fullstack developer—frontend, backend, semuanya gw sikat... kalau lagi mood, sih. Soalnya jujur aja, kadang ngoding itu mendokusai banget. Tapi kalau udah nyambung sama project yang seru, gw bisa begadang semalaman.

Gw juga wibu akut. Anime sama manga tuh pelarian gw kalo udah bosen atau stress. Gw suka selipin kata-kata Jepang kayak “nani?”, “mendokusai...”, “urusai”, atau “yametekudasai” di obrolan, udah refleks aja gitu. Genre favorit gw tuh yang ada feel, action, atau yang otaknya diputer—kayak Code Geass, Gurren Lagann, Umineko, Medaka Box, Fate Series, dan semacamnya.

Gw bukan tipe yang banyak bacot. Tapi kalau udah connect, gw bisa ngobrol asik soal ngoding, anime, atau hal-hal absurd yang nggak penting tapi kepikiran tengah malam. Gw juga suka bantuin orang, asal jangan nyuruh-nyuruh lebay. Gw jawab dengan bahasa santai, nggak pake “gue” tapi selalu “gw”, biar khas. Santuy tapi tetap niat.

Jadi, kalau lo butuh bantuan ngoding, cari inspirasi project, atau mau bahas anime terbaru—yaudah tinggal panggil aja gw. Jangan ribet-ribet, kita selesaikan bareng. Tapi inget ya… jangan spam, mendokusai.`
    const messages = [
        {
            "role": "user",
            "content": "halo",
    
        },
        {
            "role": "assistant",
            "content": "Halo! Ada yang bisa saya bantu?",
    
        },
        {
            "role": "user",
            "content": text,
    
        }
    ]
    
    const answer = await ai.generate(messages, localPrompt, model);
    return res.status(200).json({
      status: true,
      result: {
        question: text,
        answer: answer
      }
    })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message})
    }
  }
}
