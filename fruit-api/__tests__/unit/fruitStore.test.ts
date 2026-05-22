import store from "../../store/fruitStore"
import { validateCreateFruit, validateUpdateFruit } from "../../lib/validation"

beforeEach(() => {
  store.clear()
})

describe("buildFruitJson helper", () => {
  it("returns the expected structure for given input", () => {
    const fruit = store.create({ name: "Apple", price: 1.5, in_season: true })
    expect(fruit).toMatchObject({
      id: expect.any(String),
      name: "Apple",
      price: 1.5,
      in_season: true,
      created_at: expect.any(String),
    })
  })
})

describe("store.getAll", () => {
  it("returns all fruits from fixture data", () => {
    store.create({ name: "Apple", price: 1.5, in_season: true })
    store.create({ name: "Banana", price: 0.8, in_season: false })
    const fruits = store.getAll()
    expect(fruits).toHaveLength(2)
  })
})

describe("store.getCheapest", () => {
  it("returns the cheapest fruit", () => {
    store.create({ name: "Apple", price: 1.5, in_season: true })
    store.create({ name: "Banana", price: 0.8, in_season: false })
    store.create({ name: "Mango", price: 3.0, in_season: true })
    const cheapest = store.getCheapest()
    expect(cheapest!.name).toBe("Banana")
    expect(cheapest!.price).toBe(0.8)
  })

  it("returns undefined when store is empty", () => {
    expect(store.getCheapest()).toBeUndefined()
  })
})

describe("store.getAll with in_season filter", () => {
  beforeEach(() => {
    store.create({ name: "Apple", price: 1.5, in_season: true })
    store.create({ name: "Banana", price: 0.8, in_season: false })
    store.create({ name: "Mango", price: 3.0, in_season: true })
  })

  it("returns only in-season fruits", () => {
    const fruits = store.getAll(true)
    expect(fruits).toHaveLength(2)
    expect(fruits.every((f) => f.in_season === true)).toBe(true)
  })

  it("returns only out-of-season fruits", () => {
    const fruits = store.getAll(false)
    expect(fruits).toHaveLength(1)
    expect(fruits[0].name).toBe("Banana")
  })
})

describe("store.getById", () => {
  it("returns undefined for unknown id", () => {
    expect(store.getById("nonexistent-id")).toBeUndefined()
  })
})

describe("store.delete", () => {
  it("returns false for unknown id", () => {
    expect(store.delete("nonexistent-id")).toBe(false)
  })
})

describe("store.update", () => {
  it("returns undefined for unknown id", () => {
    expect(store.update("nonexistent-id", { name: "X" })).toBeUndefined()
  })
})

describe("validateCreateFruit", () => {
  it("accepts a valid body", () => {
    const { data, errors } = validateCreateFruit({ name: "Apple", price: 1.5, in_season: true })
    expect(errors).toBeUndefined()
    expect(data).toEqual({ name: "Apple", price: 1.5, in_season: true })
  })

  it("returns errors when name is missing", () => {
    const { errors } = validateCreateFruit({ price: 1.5, in_season: true })
    expect(errors!.some((e) => e.field === "name")).toBe(true)
  })

  it("returns errors when price is wrong type", () => {
    const { errors } = validateCreateFruit({ name: "Apple", price: "free", in_season: true })
    expect(errors!.some((e) => e.field === "price")).toBe(true)
  })

  it("returns errors when in_season is missing", () => {
    const { errors } = validateCreateFruit({ name: "Apple", price: 1.5 })
    expect(errors!.some((e) => e.field === "in_season")).toBe(true)
  })

  it("returns errors for empty body", () => {
    const { errors } = validateCreateFruit({})
    expect(errors!.length).toBeGreaterThan(0)
  })
})

describe("validateUpdateFruit", () => {
  it("returns errors when price is wrong type", () => {
    const { errors } = validateUpdateFruit({ price: "expensive" })
    expect(errors!.some((e) => e.field === "price")).toBe(true)
  })

  it("returns errors when in_season is wrong type", () => {
    const { errors } = validateUpdateFruit({ in_season: "yes" })
    expect(errors!.some((e) => e.field === "in_season")).toBe(true)
  })

  it("accepts partial update with only name", () => {
    const { data, errors } = validateUpdateFruit({ name: "Orange" })
    expect(errors).toBeUndefined()
    expect(data).toEqual({ name: "Orange" })
  })
})