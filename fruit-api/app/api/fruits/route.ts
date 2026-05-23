import { NextRequest, NextResponse } from "next/server"
import * as store from "../../../store/fruitStore"
import { validateCreateFruit } from "../../../lib/validation"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const inSeasonParam = searchParams.get("in_season")

  let inSeason: boolean | undefined = undefined
  if (inSeasonParam === "true") inSeason = true
  else if (inSeasonParam === "false") inSeason = false

  const fruits = await store.getAll(inSeason)
  return NextResponse.json(fruits, { status: 200 })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 })
  }

  const { data, errors } = validateCreateFruit(body)
  if (errors) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  const fruit = await store.create(data!)
  return NextResponse.json(fruit, { status: 201 })
}

export const dynamic = 'force-dynamic'