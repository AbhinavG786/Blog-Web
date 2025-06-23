import conf from "../conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }

async login({ email, password }) {
    try {
        const session = await this.account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(`Failed to login: ${error.message}`);
    }
}

async getCurrentUser() {
    try {
       return await this.account.get()
    } catch (error) {
        throw new Error(`Failed to get current user: ${error.message}`);
    }
    return null;
}

async logout() {
    try {
        await this.account.deleteSessions();
        return true;
    } catch (error) {
        throw new Error(`Failed to logout: ${error.message}`);
    }
}
}
const authService = new AuthService();
export default authService;
