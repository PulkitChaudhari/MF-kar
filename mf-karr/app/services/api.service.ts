import CryptoJS from "crypto-js";
import { config } from "../../config/config";

// Encryption key and IV - must match backend
const ENCRYPTION_KEY = "your-32-byte-secret-key-here-123";
const IV = "your-16-byte-iv-";

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private decrypt(encryptedData: any): any {
    if (!encryptedData.encrypted) {
      return encryptedData;
    }

    try {
      // Convert the encryption key and IV to WordArray
      const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
      const iv = CryptoJS.enc.Utf8.parse(IV);

      // Decode base64 and create CipherParams object
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedData.data);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
      });

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Convert to string and parse JSON
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }

  private async fetchWithDecryption(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    try {
      const response = await fetch(url, options);
      const encryptedData = await response.json();
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  // API methods
  async addInstrument(
    instrumentCode: string,
    timePeriod: string,
    currentInstruments: any
  ) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/portfolio/add-instrument`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrumentCode,
          timePeriod,
          currentInstruments,
        }),
      }
    );
  }

  async removeInstrument(instrumentCode: string, currentInstruments: any) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/portfolio/remove-instrument`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrumentCode,
          currentInstruments,
        }),
      }
    );
  }

  async analyzePortfolio(
    instrumentsData: any,
    timePeriod: number,
    initialAmount: number,
    investmentMode: String
  ) {
    return this.fetchWithDecryption(`${config.apiUrl}/api/portfolio/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instrumentsData,
        timePeriod,
        initialAmount,
        investmentMode,
      }),
    });
  }

  async compareIndex(
    indexName: string,
    timePeriod: number,
    initialAmount: number,
    investmentMode: string
  ) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/portfolio/compare-index`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indexName,
          timePeriod,
          initialAmount,
          investmentMode,
        }),
      }
    );
  }

  async loadPortfolio(portfolioData: any, timePeriod: number) {
    return this.fetchWithDecryption(`${config.apiUrl}/api/portfolio/load`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolioData,
        timePeriod,
      }),
    });
  }

  async replacePortfolio(
    emailId: string,
    instrumentsData: any[],
    portfolioName: string
  ) {
    return this.fetchWithDecryption(`${config.apiUrl}/api/portfolio/replace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        instrumentsData,
        portfolioName,
      }),
    });
  }

  async deletePortfolio(emailId: string, portfolioName: string) {
    return this.fetchWithDecryption(`${config.apiUrl}/api/portfolio/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        portfolioName,
      }),
    });
  }

  async savePortfolio(
    emailId: string,
    instrumentsData: any[],
    portfolioName: string
  ) {
    return this.fetchWithDecryption(`${config.apiUrl}/api/portfolio/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        instrumentsData,
        portfolioName,
      }),
    });
  }

  async getPortfolios(emailId: string) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/portfolio/getPortfolios/${emailId}`
    );
  }

  async searchInstruments(query: string) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/instruments/${query}`
    );
  }

  async changeTimePeriod(timePeriod: number, currentInstruments: any) {
    return this.fetchWithDecryption(
      `${config.apiUrl}/api/portfolio/change-time-period`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timePeriod,
          currentInstruments,
        }),
      }
    );
  }
}

export const apiService = ApiService.getInstance();
