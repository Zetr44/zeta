const axios = require("axios");

function generateRandomString(length = 11) {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	return Array.from(crypto.getRandomValues(new Uint32Array(length)))
		.map((n) => chars[n % chars.length])
		.join("");
}

async function getImage(imageUrl) {
	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error(
			`Image fetch failed: ${response.status} ${response.statusText}`,
		);
	}
	return response.blob();
}

async function uploadImage(imageBlob, uploadId, filename = "natsumi.jpg") {
	const formData = new FormData();
	formData.append("files", imageBlob, filename);

	const response = await fetch(
		`https://jamesliu1217-easycontrol-ghibli.hf.space/gradio_api/upload?upload_id=${uploadId}`,
		{
			method: "POST",
			body: formData,
			headers: { accept: "*/*" },
		},
	);

	if (!response.ok) {
		throw new Error(
			`Image upload failed: ${response.status} ${response.statusText}`,
		);
	}

	const [filePath] = await response.json();
	return {
		path: filePath,
		url: `https://jamesliu1217-easycontrol-ghibli.hf.space/gradio_api/file=${filePath}`,
		orig_name: filename,
		size: imageBlob.size,
		mime_type: imageBlob.type,
		meta: { _type: "gradio.FileData" },
	};
}

async function joinQueue(fileData, session_hash, width, height, seed = null) {
	const payload = {
		data: [
			"Ghibli Studio style, Charming hand-drawn anime-style illustration",
			fileData,
			width,
			height,
			seed,
			"Ghibli",
			false,
			1,
		],
		fn_index: 1,
		session_hash,
	};

	const response = await fetch(
		"https://jamesliu1217-easycontrol-ghibli.hf.space/gradio_api/queue/join",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Queue join failed: ${response.status} ${response.statusText}`,
		);
	}

	const { event_id } = await response.json();
	return event_id;
}

async function listenToQueue(session_hash) {
	const response = await fetch(
		`https://jamesliu1217-easycontrol-ghibli.hf.space/gradio_api/queue/data?session_hash=${session_hash}`,
		{ headers: { accept: "text/event-stream" } },
	);

	if (!response.ok || !response.body) {
		throw new Error("Event stream connection failed");
	}

	const reader = response.body
		.pipeThrough(new TextDecoderStream())
		.getReader();

	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			const events = value
				.trim()
				.split("\n")
				.filter((line) => line.startsWith("data:"))
				.map((line) => JSON.parse(line.slice(5)));

			for (const event of events) {
				if (event.msg === "process_completed") {
					if (!event.success) {
						throw new Error("Server-side processing failed");
					}
					return event.output.data[0].url;
				}

				if (event.msg === "close_stream") {
					throw new Error("Server closed connection prematurely");
				}
			}
		}
	} finally {
		reader.cancel();
	}

	throw new Error("Event stream terminated without result");
}

async function generateGhibliImage(imageUrl, options = {}) {
	const { width = 768, height = 768, seed = 42 } = options;

	const imageBlob = await getImage(imageUrl);
	const uploadId = generateRandomString();
	const fileData = await uploadImage(imageBlob, uploadId);
	const session_hash = generateRandomString();

	await joinQueue(fileData, session_hash, width, height, seed);
	return listenToQueue(session_hash);
}
	
module.exports = {
  name: "Ghibli Art Style",
  desc: "Convert an image to Ghibli art style",
  category: "Tools",
  params: ["url"],
  apikey: true,
  async run(req, res) {
    try {
      const { url } = req.query;
      if (!url) return res.status(400).json({ status: false, error: "Url parameter is required!"})
      
      logRequest(req.path);
      
      const rees = await generateGhibliImage(url, { width: 1024, height: 1024 });
      return res.status(200).json({
        status: true,
        result: {
          before: url,
          after: rees
        }
      })
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message })
    }
  }
}
