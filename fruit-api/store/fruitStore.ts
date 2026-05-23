import pool, { initDB } from "../lib/db"
import { Fruit, CreateFruitDTO, UpdateFruitDTO } from "../models/fruit"
import { randomUUID } from "crypto"

let initialized = false

async function ensureInit() {
  if (!initialized) {
    await initDB()
    initialized = true
  }
}

export async function getAll(inSeason?: boolean): Promise<Fruit[]> {
  await ensureInit()
  if (inSeason !== undefined) {
    const [rows] = await pool.execute("SELECT * FROM fruits WHERE in_season = ?", [inSeason])
    return (rows as Record<string, unknown>[]).map(mapFruit)
  }
  const [rows] = await pool.execute("SELECT * FROM fruits")
  return (rows as Record<string, unknown>[]).map(mapFruit)
}

function mapFruit(row: Record<string, unknown>): Fruit {
  return {
    id: row.id as string,
    name: row.name as string,
    price: parseFloat(row.price as string),
    in_season: Boolean(row.in_season),
    created_at: row.created_at as string,
  }
}

export async function getById(id: string): Promise<Fruit | undefined> {
  await ensureInit()
  const [rows] = await pool.execute("SELECT * FROM fruits WHERE id = ?", [id])
  const fruits = (rows as Record<string, unknown>[]).map(mapFruit)
  return fruits[0]
}

export async function getCheapest(): Promise<Fruit | undefined> {
  await ensureInit()
  const [rows] = await pool.execute("SELECT * FROM fruits ORDER BY price ASC LIMIT 1")
  const fruits = (rows as Record<string, unknown>[]).map(mapFruit)
  return fruits[0]
}

export async function create(dto: CreateFruitDTO): Promise<Fruit> {
  await ensureInit()
  const id = randomUUID()
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ')

  await pool.execute(
    "INSERT INTO fruits (id, name, price, in_season, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, dto.name, dto.price, dto.in_season, created_at]
  )

  return { id, name: dto.name, price: dto.price, in_season: dto.in_season, created_at }
}

export async function update(id: string, dto: UpdateFruitDTO): Promise<Fruit | undefined> {
  await ensureInit()
  const existing = await getById(id)
  if (!existing) return undefined

  const updated = {
    ...existing,
    ...(dto.name !== undefined && { name: dto.name }),
    ...(dto.price !== undefined && { price: dto.price }),
    ...(dto.in_season !== undefined && { in_season: dto.in_season }),
  }

  await pool.execute(
    "UPDATE fruits SET name = ?, price = ?, in_season = ? WHERE id = ?",
    [updated.name, updated.price, updated.in_season, id]
  )

  return updated
}

export async function deleteFruit(id: string): Promise<boolean> {
  await ensureInit()
  const [result] = await pool.execute("DELETE FROM fruits WHERE id = ?", [id])
  const res = result as { affectedRows: number }
  return res.affectedRows > 0
}