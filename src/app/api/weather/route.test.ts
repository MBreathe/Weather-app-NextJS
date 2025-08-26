import { POST } from "./route";

describe("/api/weather/POST", () => {
  function createReq(body: any) {
    return new Request("http://localhost/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  it("Should accept one argument", () => {
    expect(POST.length).toBe(1);
  });
  it("Should return 200 on success", async () => {
    const response = await POST(createReq({ city: "London" }));
    expect(response.status).toBe(200);
  });
  it("Should return a response with JSON body that contains API specific key: main", async () => {
    const response = await POST(createReq({ city: "New York" }));
    const data = await response.json();
    expect(data).toHaveProperty("main");
    expect(typeof data.main).toBe("object");
  });
  it("Should have a response body of {message: string} when error occurs", async () => {
    const response = await POST(createReq({ userId: 123456789 }));
    const data = await response.json();
    expect(data).toHaveProperty("message");
    expect(typeof data.message).toBe("string");
  });
  it("Should return 400 if the request body is invalid", async () => {
    const response = await POST(createReq({ userId: 123456789 }));
    expect(response.status).toBe(400);
  });
});
