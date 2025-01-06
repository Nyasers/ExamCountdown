import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
    icon: path.resolve(__dirname, '../assets', 'icon.ico'),
}