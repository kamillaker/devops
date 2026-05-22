const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/unit/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { moduleResolution: "node" } }],
  },
}

export default config