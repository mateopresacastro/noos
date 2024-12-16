import CryptoJS from "crypto-js";

export async function md5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        if (!(buffer instanceof ArrayBuffer)) {
          throw new Error("Failed to read file as ArrayBuffer.");
        }

        const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
        const md5Hash = CryptoJS.MD5(wordArray);
        const base64Hash = md5Hash.toString(CryptoJS.enc.Base64);
        resolve(base64Hash);
      } catch (error) {
        console.error("Error generating MD5 hash:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
