import { AxiosRequestConfig, AxiosResponse } from "axios";
interface ResponseDta<T = any> {
    /** code 值 0 代表正常 */
    code: number;
    /** 数据值 */
    data: T;
    msg: string;
}
export interface ResponsePromise<T = any> extends Promise<ResponseDta<T>> {
}
interface ResponseFile extends AxiosResponse<Blob> {
    /** 文件名 */
    fileName: string;
}
export interface ResponseFilePromise extends Promise<ResponseFile> {
}
/**
 * blob 数据保存为文件
 * @param {*} blobData blob数据
 * @param {string} fileName 保存文件名、在mac上，文件名必须要写后缀，要不然下载会有问题、在window上可以忽略
 */
export declare function blobSaveFile(blobData: BlobPart, fileName: string): any;
declare const http: {
    request<T>(axiosConfig: AxiosRequestConfig): ResponseFilePromise | ResponsePromise<T>;
    get<T_1 = any>(url: string, params?: object, config?: AxiosRequestConfig): ResponsePromise<T_1>;
    /** post application/x-www-form-urlencoded */
    post<T_2 = any>(url: string, data?: object, config?: AxiosRequestConfig): ResponsePromise<T_2>;
    /** post application/json */
    postJson<T_3 = any>(url: string, data?: object, config?: AxiosRequestConfig): ResponsePromise<T_3>;
    /** post multipart/form-data */
    postForm<T_4>(url: string, data?: object): ResponsePromise<T_4>;
    /** 下载文件 responseType: "blob"  */
    downloadFile(config: AxiosRequestConfig): ResponseFilePromise;
    /** 下载文件并保存 */
    downloadFileSava(config: AxiosRequestConfig, defaultFileName?: string): ResponseFilePromise;
};
export declare type Http = typeof http;
export default http;
