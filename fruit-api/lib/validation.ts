import { CreateFruitDTO, UpdateFruitDTO } from "../models/fruit"

export interface ValidationError {
  field: string
  message: string
}

export function validateCreateFruit(body: unknown): {
  data?: CreateFruitDTO
  errors?: ValidationError[]
} {
  const errors: ValidationError[] = []

  if (typeof body !== "object" || body === null) {
    return { errors: [{ field: "body", message: "Request body must be a JSON object" }] }
  }

  const b = body as Record<string, unknown>

  if (!b.name) {
    errors.push({ field: "name", message: "name is required" })
  } else if (typeof b.name !== "string" || b.name.trim() === "") {
    errors.push({ field: "name", message: "name must be a non-empty string" })
  }

  if (b.price === undefined || b.price === null) {
    errors.push({ field: "price", message: "price is required" })
  } else if (typeof b.price !== "number" || isNaN(b.price) || b.price < 0) {
    errors.push({ field: "price", message: "price must be a non-negative number" })
  }

  if (b.in_season === undefined || b.in_season === null) {
    errors.push({ field: "in_season", message: "in_season is required" })
  } else if (typeof b.in_season !== "boolean") {
    errors.push({ field: "in_season", message: "in_season must be a boolean" })
  }

  if (errors.length > 0) return { errors }

  return {
    data: {
      name: (b.name as string).trim(),
      price: b.price as number,
      in_season: b.in_season as boolean,
    },
  }
}

export function validateUpdateFruit(body: unknown): {
  data?: UpdateFruitDTO
  errors?: ValidationError[]
} {
  const errors: ValidationError[] = []

  if (typeof body !== "object" || body === null) {
    return { errors: [{ field: "body", message: "Request body must be a JSON object" }] }
  }

  const b = body as Record<string, unknown>
  const data: UpdateFruitDTO = {}

  if (b.name !== undefined) {
    if (typeof b.name !== "string" || b.name.trim() === "") {
      errors.push({ field: "name", message: "name must be a non-empty string" })
    } else {
      data.name = b.name.trim()
    }
  }

  if (b.price !== undefined) {
    if (typeof b.price !== "number" || isNaN(b.price) || b.price < 0) {
      errors.push({ field: "price", message: "price must be a non-negative number" })
    } else {
      data.price = b.price
    }
  }

  if (b.in_season !== undefined) {
    if (typeof b.in_season !== "boolean") {
      errors.push({ field: "in_season", message: "in_season must be a boolean" })
    } else {
      data.in_season = b.in_season
    }
  }

  if (errors.length > 0) return { errors }
  return { data }
}