import { GET } from "./route";

describe("sandbox", () => {
  it("Should respond with status 200", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });
  it("Should have response format of {message: string}", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty("message");
    expect(typeof data.message).toBe("string");
  });
  it("Should respond with a message of Hello World", async () => {
    const response = await GET();
    const data = await response.json();
    expect(data.message).toBe("Hello World");
  });
});
