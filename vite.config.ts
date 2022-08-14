/*
 * @Author: Tian
 * @Date: 2022-08-03 09:01:51
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 18:39:08
 * @Description:
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
const path = require('path')
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
const { name }: Record<string, any> = require('./package.json')
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
    server: {
        port: 9090,
        strictPort: true, // 严格端口 true:如果端口已被使用，则直接退出，而不会再进行后续端口的尝试。
        open: true,
        /**
         * @description 解决chrome设置origin:*也跨域机制,代理/api前缀到服务基地址
         * 最终的地址会将axios设置的baseUrl:/api代理拼接成[target][/api],然后通过rewrite重写掉/api为'' 这样就是我们真实的基地址了
         */
        proxy: {
            '/api': {
                // target: 'http://111.26.1.82:44530', // 接口基地址
                // target: 'https://wgms.jilin.fpi-inc.site:9080', // 接口基地址
                target: 'http://wgms.dev.fpi-inc.site', // 接口基地址
                // target: 'http://wgms-test.fpi-inc.site', // 接口基地址
                rewrite: path => path.replace(/^\/api/, ''),
                changeOrigin: true
            }
        }
    },
    // 强制预构建插件包
    optimizeDeps: {
        include: ['@ued_fpi/uview-ui']
    },
    plugins: [
        uni(),
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/ // .md
            ],
            imports: ['vue', 'pinia'],
            eslintrc: {
                enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
                filepath: './.eslintrc-auto-import.json', // 生成json文件
                globalsPropValue: true
            },
            // 声明文件生成位置和文件名称
            dts: './src/auto-import.d.ts'
        }),
        Components({
            dirs: ['src/components'],
            extensions: ['vue'],
            // 配置文件生成位置
            dts: 'src/components.d.ts'
        })
    ],
    base: isProduction ? `/${name}/` : '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src') // 设置 @ 指向 src
        }
    }
})
