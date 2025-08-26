import dotenv from "dotenv";
dotenv.config();

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not defined");
    }

    const { city } = await req.json();
    if (!city) {
      return Response.json({ message: "City is required" }, { status: 400 });
    }
    const regex = RegExp(/^[a-zA-Z ]+$/);
    if (!regex.test(city)) {
      return Response.json(
        { message: "City must be a string containing only letters and spaces" },
        { status: 400 }
      );
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
