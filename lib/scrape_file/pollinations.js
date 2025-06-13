const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const os = require('os')
 
async function pollinations(prompt) {
  try {
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`
    const response = await axios.get(imageUrl, { responseType: 'stream' })
    const tempPath = path.join(os.tmpdir(), 'temp_image.jpg')
    const writer = fs.createWriteStream(tempPath)
    response.data.pipe(writer)
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', fs.createReadStream(tempPath))
    const upload = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })
    fs.unlinkSync(tempPath)
    return upload.data
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  pollinations
};
