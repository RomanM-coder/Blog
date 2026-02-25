type SectionType = 'text' | 'image'

interface SectionBase {
  type: SectionType
  order: number
}

interface TextSection extends SectionBase {
  type: 'text'
  content: string
}

interface ImageSection extends SectionBase {
  type: 'image'
  path: string
  alt: string
  imageFile?: File | null
}

type Section = TextSection | ImageSection

export interface IPostForm {
  _id?: string
  title: string
  title_ru: string
  sections: Section[] | []
  sections_ru: Section[] | []
  favorite: number
  nofavorite: number
  views: number
  // createdAt: Date
}
