import conf from "../conf/conf.js";
import { Client,Databases,Storage,Query, ID } from "appwrite";

export class Service{
    client=new Client();
    databases;
    bucket
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }

    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
     return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { title, content ,featuredImage,status,userId}
            );
        } catch (error) {
            throw new Error(`Failed to create post: ${error.message}`);
        }
    }

    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { title, content ,featuredImage,status}
            );
        } catch (error) {
            throw new Error(`Failed to update post: ${error.message}`);
        }
    }

    async deletePost(slug){
        try {
             await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true
        } catch (error) {
            throw new Error(`Failed to delete post: ${error.message}`);
            return false;
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            throw new Error(`Failed to get post: ${error.message}`);
            return false
        }
    }

    async getPosts(queries=[Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            );
        } catch (error) {
            throw new Error(`Failed to get posts: ${error.message}`);
            return false;
        }
    }

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        }
        catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        );
    }
}

const service=new Service();

export default service;