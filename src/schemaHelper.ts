import axios, { AxiosResponse } from 'axios'
import { paths } from 'schema'
import { UnionToIntersection, Get } from 'type-fest'

export type UrlPaths = keyof paths
export type HttpMethods = keyof UnionToIntersection<paths[keyof paths]>
export type HttpMethodsFilteredByPath<Path extends UrlPaths> = HttpMethods & keyof UnionToIntersection<paths[Path]>
export type RequestParameters<Path extends UrlPaths, Method extends HttpMethods> = Get<
  paths,
  `${Path}.${Method}.parameters.query`
>

export type RequestData<Path extends UrlPaths, Method extends HttpMethods> = Get<
  paths,
  `${Path}.${Method}.requestBody.content.application/json`
>
export type ResponseData<Path extends UrlPaths, Method extends HttpMethods> = Get<
  paths,
  `${Path}.${Method}.responses.200.content.application/json`
>
export type AxiosConfigWrapper<Path extends UrlPaths, Method extends HttpMethods> = {
  url: Path
  method: Method & HttpMethodsFilteredByPath<Path>
  params?: RequestParameters<Path, Method>
  data?: RequestData<Path, Method>
}
export function request<Path extends UrlPaths, Method extends HttpMethods>(
  config: AxiosConfigWrapper<Path, Method>,
  id?: number
) {
  return axios.request<
    ResponseData<Path, Method>,
    AxiosResponse<ResponseData<Path, Method>>,
    AxiosConfigWrapper<Path, Method>['data']
  >(typeof id === 'number' ? { ...config, url: config.url.replace(/{.*}/g, id.toString()) } : config)
}
