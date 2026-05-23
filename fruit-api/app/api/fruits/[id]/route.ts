import { NextRequest, NextResponse } from "next/server"
import * as store from "../../../../store/fruitStore"
import { validateUpdateFruit } from "../../../../lib/validation"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const fruit = await store.getById(id)
  if (!fruit) {
    return NextResponse.json({ error: "Fruit not found" }, { status: 404 })
  }
  return NextResponse.json(fruit, { status: 200 })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  if (!await store.getById(id)) {
    return NextResponse.json({ error: "Fruit not found" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 })
  }

  const { data, errors } = validateUpdateFruit(body)
  if (errors) {
    return NextResponse.json({ errors }, { status: 422 })
  }

  const updated = await store.update(id, data!)
  return NextResponse.json(updated, { status: 200 })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const deleted = await store.deleteFruit(id)
  if (!deleted) {
    return NextResponse.json({ error: "Fruit not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}

export const dynamic = 'force-dynamic'