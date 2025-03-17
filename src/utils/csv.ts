import https from "https";
import zlib from "zlib";

import { tsvParse } from "d3-dsv";

export async function downloadAndParseTsv(url: string, isGzip: boolean) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks: Array<any> = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", async () => {
            const buffer = Buffer.concat(chunks);
            if (!isGzip) {
              const parsedData = tsvParse(buffer.toString("utf-8")); // Specify UTF-8 encoding
              resolve(parsedData); // Return the parsed data as an array of rows
              return parsedData;
            }

            zlib.gunzip(buffer, async (error, decompressedData) => {
              if (error) {
                reject(error);
                return null;
              }
              const parsedData = tsvParse(decompressedData.toString("utf-8")); // Specify UTF-8 encoding
              resolve(parsedData); // Return the parsed data as an array of rows
              return parsedData;
            });
          });
        } else {
          reject(new Error(`Error downloading file: ${response.statusCode}`));
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export async function downloadAndParseJson(
  url: string,
  isGzip: boolean
): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const chunks: Array<any> = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", async () => {
            const buffer = Buffer.concat(chunks);
            if (!isGzip) {
              try {
                const parsedData = JSON.parse(buffer.toString("utf-8")); // Parse JSON data
                resolve(parsedData); // Return the parsed JSON data
              } catch (error) {
                reject(new Error(`Failed to parse JSON: ${error}`));
              }
              return;
            }

            zlib.gunzip(buffer, async (error, decompressedData) => {
              if (error) {
                reject(error);
                return;
              }
              try {
                const parsedData = JSON.parse(
                  decompressedData.toString("utf-8")
                ); // Parse JSON data
                resolve(parsedData); // Return the parsed JSON data
              } catch (parseError) {
                reject(new Error(`Failed to parse JSON: ${parseError}`));
              }
            });
          });
        } else {
          reject(new Error(`Error downloading file: ${response.statusCode}`));
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
