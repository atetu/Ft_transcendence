import { Service } from "typedi";
import * as http from "http";
import * as https from "https";
import * as crypto from "crypto";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path  from "path";
import { URL } from "url";

@Service()
export default class AvatarService {
  baseDirectory: string;

  constructor() {
    this.baseDirectory = "data/pictures";
  }

  async download(url: string): Promise<string> {
    const extension = path.extname(url)

    console.log(extension)
    console.log(url)

    const hash = this.generateRandomFileName() + extension;
    const dest = this.getDestination(hash)

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest, { flags: "wx" });

      const request = this.getHttpClient(url).get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
        } else {
          file.close();
          fs.unlink(dest, () => {});

          reject(
            `Server responded with ${response.statusCode}: ${response.statusMessage}`
          );
        }
      });

      request.setTimeout(12000, function () {
        request.abort();
      });

      request.on("error", (err) => {
        file.close();
        fs.unlink(dest, () => {});

        reject(err.message);
      });

      file.on("finish", () => {
        resolve(hash);
      });

      file.on("error", (err) => {
        file.close();

        if (err.code === "EEXIST") {
          reject("File already exists");
        } else {
          fs.unlink(dest, () => {});

          reject(err.message);
        }
      });
    });
  }

  generateRandomFileName(): string {
    return crypto.randomBytes(20).toString("hex");
  }

  getHttpClient(rawUrl: string) {
    const url = new URL(rawUrl);

    if (url.protocol == "https:") {
      return https;
    } else {
      return http;
    }
  }

  getDestination(hash: string) {
   return `${this.baseDirectory}/${hash}`;
  }

  async install() {
    fsExtra.ensureDirSync(this.baseDirectory)
  }
}
