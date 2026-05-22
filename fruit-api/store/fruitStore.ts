import { Fruit, CreateFruitDTO, UpdateFruitDTO } from "../models/fruit"
import { randomUUID } from "crypto"

class FruitStore {
  private fruits: Map<string, Fruit> = new Map()

  getAll(inSeason?: boolean): Fruit[] {
    const all = Array.from(this.fruits.values())
    if (inSeason === undefined) return all
    return all.filter((f) => f.in_season === inSeason)
  }

  getById(id: string): Fruit | undefined {
    return this.fruits.get(id)
  }

  getCheapest(): Fruit | undefined {
    const all = Array.from(this.fruits.values())
    if (all.length === 0) return undefined
    return all.reduce((min, f) => (f.price < min.price ? f : min))
  }

  create(dto: CreateFruitDTO): Fruit {
    const fruit: Fruit = {
      id: randomUUID(),
      name: dto.name,
      price: dto.price,
      in_season: dto.in_season,
      created_at: new Date().toISOString(),
    }
    this.fruits.set(fruit.id, fruit)
    return fruit
  }

  update(id: string, dto: UpdateFruitDTO): Fruit | undefined {
    const existing = this.fruits.get(id)
    if (!existing) return undefined
    const updated: Fruit = {
      ...existing,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.in_season !== undefined && { in_season: dto.in_season }),
    }
    this.fruits.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.fruits.delete(id)
  }

  clear(): void {
    this.fruits.clear()
  }
}

const globalForStore = global as typeof global & { fruitStore?: FruitStore }
if (!globalForStore.fruitStore) {
  globalForStore.fruitStore = new FruitStore()
}
const store = globalForStore.fruitStore
export default store