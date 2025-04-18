const fs = require("fs");
const path = require("path");
const textToSpeech = require("@google-cloud/text-to-speech");
const util = require("util");

// List of output filenames in order
const outputFiles = [
  "alif.mp3",
  "baa.mp3",
  "taa.mp3",
  "thaa.mp3",
  "jiim.mp3",
  "h_aa.mp3",
  "khaa.mp3",
  "dal.mp3",
  "dhal.mp3",
  "raa.mp3",
  "zay.mp3",
  "siin.mp3",
  "shiin.mp3",
  "s_aad.mp3",
  "d_aad.mp3",
  "t_aa.mp3",
  "d_haa.mp3",
  "ain.mp3",
  "ghain.mp3",
  "faa.mp3",
  "qaaf.mp3",
  "kaaf.mp3",
  "laam.mp3",
  "miim.mp3",
  "nun.mp3",
  "haa.mp3",
  "waaw.mp3",
  "yaa.mp3",
];

async function convertTextToSpeech() {
  try {
    // Read the Arabic text file
    const text = fs.readFileSync("arabic.txt", "utf8");
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    if (lines.length !== outputFiles.length) {
      console.error(
        `Error: The text file has ${lines.length} lines, but expected ${outputFiles.length} lines.`
      );
      return;
    }

    // Create client using the credentials file
    const client = new textToSpeech.TextToSpeechClient({
      keyFilename: "texttospeechproject-236813-87f3a910f49e.json",
    });

    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const outputFile = outputFiles[i];

      // Construct the request
      const request = {
        input: { text: line },
        voice: {
          languageCode: "ar-XA", // Arabic language code
          name: "ar-XA-Standard-A", // Arabic voice
        },
        audioConfig: { audioEncoding: "MP3" },
      };

      // Perform the text-to-speech request
      const [response] = await client.synthesizeSpeech(request);

      // Write the binary audio content to a file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(outputFile, response.audioContent, "binary");

      console.log(`Audio content written to file: ${outputFile}`);
    }

    console.log("All files have been generated successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

convertTextToSpeech();
