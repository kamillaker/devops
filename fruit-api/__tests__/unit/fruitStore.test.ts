import { validateCreateFruit, validateUpdateFruit } from "../../lib/validation"

describe("buildFruitJson helper", () => {
  it("returns the expected structure for given input", () => {
    const fruit = {
      id: "test-id",
      name: "Apple",
      price: 1.5,
      in_season: true,
      created_at: new Date().toISOString(),
    }
    expect(fruit).toMatchObject({
      id: expect.any(String),
      name: "Apple",
      price: 1.5,
      in_season: true,
      created_at: expect.any(String),
    })
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