export interface ISectionPost {
  type: 'text' | 'image'
  content?: string // Необязательное, так как conditional required трудно выразить в TypeScript
  path?: string // Необязательное, по той же причине
  alt?: string
  order?: Number
}
