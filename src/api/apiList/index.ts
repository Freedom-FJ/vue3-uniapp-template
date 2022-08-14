const contexts: any = import.meta.globEager('./module/**/*.ts') // module下的所有文件夹下的ts文件
const keyApi = Object.keys(contexts)
const Api: { [key: string]: any } = {}
keyApi.forEach((item: string) => {
    const keys: string = item.replace(/(\.\/module\/|\.ts)/g, '') // 去除末尾的.ts
    Api[keys.substring(keys.lastIndexOf('/') + 1)] = contexts[item]
})
export default Api
