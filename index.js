import * as fs from 'fs'
import { globSync } from 'glob'

function htmlPartialPlugin() {
    let basePath

    return {
        name: 'jboettcher:html-partial',

        configResolved(resolvedConfig) {
            basePath = resolvedConfig.htmlPartialPlugin.basePath ? resolvedConfig.htmlPartialPlugin.basePath : './src/';
        },

        transformIndexHtml(html, ctx) {
            html.match(/include\((.*)\)/g).forEach((match) => {
                const path = match.replace(/include\('|'\)/g, '')
                const filePath = globSync(basePath + path);
                if (filePath.length === 1) {
                    const fileData = fs.readFileSync(filePath[0], 'utf8')
                    html = html.replace(match, fileData)
                } else {
                    html = html.replace(match, `<p style="color:red;font-weight:bold;">${path} not found</p>`)
                }
            })
            return html
        }
    }
}

export default htmlPartialPlugin; 