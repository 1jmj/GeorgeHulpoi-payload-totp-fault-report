// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { payloadTotp } from 'payload-totp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // payloadTotp({
    //   collection: 'users',
    //   totp: {
    //     algorithm: 'SHA1',
    //     digits: 6,
    //     issuer: 'sha1-test',
    //     period: 30,
    //   },
    //   forceSetup: true,
    // }),
    payloadTotp({
      collection: 'users',
      totp: {
        algorithm: 'SHA256',
        digits: 6,
        issuer: 'sha256-test',
        period: 30,
      },
      forceSetup: true,
    }),
    // payloadTotp({
    //   collection: 'users',
    //   totp: {
    //     algorithm: 'SHA512',
    //     digits: 6,
    //     issuer: 'sha512-test',
    //     period: 30,
    //   },
    //   forceSetup: true,
    // }),
  ],
})
