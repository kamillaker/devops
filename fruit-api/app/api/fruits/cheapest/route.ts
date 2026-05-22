import { NextResponse } from "next/server"
import store from "../../../../store/fruitStore"

export async function GET() {
  const fruit = store.getCheapest()
  if (!fruit) {
    return NextResponse.json({ error: "No fruits available" }, { status: 404 })
  }
  return NextResponse.json(fruit, { status: 200 })
}

export const dynamic = 'force-dynamic'