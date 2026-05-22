export interface Fruit {
  id: string
  name: string
  price: number
  in_season: boolean
  created_at: string
}

export interface CreateFruitDTO {
  name: string
  price: number
  in_season: boolean
}

export interface UpdateFruitDTO {
  name?: string
  price?: number
  in_season?: boolean
}