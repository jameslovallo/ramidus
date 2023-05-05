import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
  branch,
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io
  build: {
    outputFolder: 'admin',
    publicFolder: '/',
  },
  media: {
    tina: {
      mediaRoot: '@/posts/media',
      publicFolder: '/',
    },
  },
  schema: {
    collections: [
      {
        name: 'post',
        label: 'Posts',
        path: '@/posts',
        fields: [
          {
            type: 'string',
            label: 'Title',
            name: 'title',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'heroImg',
            label: 'Hero Image',
          },
          {
            type: 'rich-text',
            label: 'Body',
            name: 'body',
            isBody: true,
          },
          {
            type: 'datetime',
            label: 'Posted Date',
            name: 'date',
            ui: {
              dateFormat: 'MMMM DD YYYY',
              timeFormat: 'hh:mm A',
            },
          },
        ],
        defaultItem: () => {
          return {
            title: 'My New Post',
            date: Date.now(),
          }
        },
      },
    ],
  },
})
