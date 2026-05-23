import { NextResponse } from "next/server"
import * as store from "../../../../store/fruitStore"

export async function GET() {
  const fruit = await store.getCheapest()
  if (!fruit) {
    return NextResponse.json({ error: "No fruits available" }, { status: 404 })
  }
  return NextResponse.json(fruit, { status: 200 })
}

export const dynamic = 'force-dynamic'