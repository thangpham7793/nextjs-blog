import fs from "fs"
import path from "path"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

const postDir = path.join(process.cwd(), "posts")

type post = {
  id: string
  data: {
    title: string
    date: string
  }
  content?: string
}

export type dtoPost = {
  id: string
  title: string
  date: string
  content?: string
}

function getPosts(): post[] {
  const fileNames = fs.readdirSync(postDir)
  return fileNames.map(
    (f): post => {
      const id = f.replace(/\.md$/, "")
      const fullPath = path.join(postDir, f)
      const content = fs.readFileSync(fullPath, "utf8")
      const matterResult = (matter(content) as unknown) as Partial<post>
      return {
        id,
        data: matterResult.data,
      }
    }
  )
}

function toDtoPost({ id, data }: post): dtoPost {
  return {
    id,
    ...data,
  }
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDir)
  return fileNames.map((f) => {
    return {
      params: {
        id: f.replace(/\.md$/, ""),
      },
    }
  })
}

export function getSortedPostsData() {
  return getPosts()
    .map(toDtoPost)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1
      }
      return -1
    })
}

async function processHTML(content: string) {
  const raw = await remark().use(html).process(content)
  return raw.toString()
}

export async function getPostData(id: string): Promise<dtoPost> {
  const fullPath = path.join(postDir, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = (matter(fileContents) as unknown) as post
  return {
    id,
    content: await processHTML(content),
    ...data,
  }
}
