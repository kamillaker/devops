const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

async function req(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  let data: unknown
  try { data = await res.json() } catch { data = null }
  return { status: res.status, data }
}

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const { status, data } = await req("GET", "/api/health")
    expect(status).toBe(200)
    expect(data).toEqual({ status: "ok" })
  })
})

describe("CRUD lifecycle", () => {
  let createdId: string

  beforeAll(async () => {
    const { data } = await req("POST", "/api/fruits", {
      name: "Integration Mango", price: 2.5, in_season: true,
    })
    createdId = (data as Record<string, unknown>).id as string
  })

  it("POST creates a fruit", async () => {
    expect(typeof createdId).toBe("string")
    expect(createdId.length).toBeGreaterThan(0)
  })

  it("GET by id returns the fruit", async () => {
    const { status } = await req("GET", `/api/fruits/${createdId}`)
    expect(status).toBe(200)
  })

  it("GET list includes the new fruit", async () => {
    const { data } = await req("GET", "/api/fruits")
    const list = data as Array<Record<string, unknown>>
    expect(list.some((f) => f.id === createdId)).toBe(true)
  })

  it("PUT updates the fruit", async () => {
    const { status, data } = await req("PUT", `/api/fruits/${createdId}`, { price: 3.0 })
    expect(status).toBe(200)
    expect((data as Record<string, unknown>).price).toBe(3.0)
  })

  it("DELETE returns 204", async () => {
    const { status } = await req("DELETE", `/api/fruits/${createdId}`)
    expect(status).toBe(204)
  })

  it("GET after DELETE returns 404", async () => {
    const { status } = await req("GET", `/api/fruits/${createdId}`)
    expect(status).toBe(404)
  })
})

describe("cheapest consistency", () => {
  it("price matches minimum from list", async () => {
    await req("POST", "/api/fruits", { name: "Apple", price: 1.5, in_season: true })
    await req("POST", "/api/fruits", { name: "Banana", price: 0.6, in_season: false })
    const { data: listData } = await req("GET", "/api/fruits")
    const list = listData as Array<{ price: number }>
    const minPrice = Math.min(...list.map((f) => f.price))
    const { status, data } = await req("GET", "/api/fruits/cheapest")
    expect(status).toBe(200)
    expect((data as { price: number }).price).toBe(minPrice)
  })
})

describe("POST with invalid body", () => {
  it("returns 422 for empty body", async () => {
    const { status } = await req("POST", "/api/fruits", {})
    expect(status).toBe(422)
  })

  it("returns 422 for missing name", async () => {
    const { status } = await req("POST", "/api/fruits", { price: 1.0, in_season: true })
    expect(status).toBe(422)
  })
})