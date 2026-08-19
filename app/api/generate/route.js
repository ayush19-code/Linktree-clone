import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    // Get data from frontend
    const body = await request.json();

    console.log("Received data:", body);

    // Connect to MongoDB
    const client = await clientPromise;

    console.log("MongoDB connected successfully");

    // Select database
    const db = client.db("bitlinks");

    // Select collection
    const collection = db.collection("links");

    console.log("Database and collection selected");

    // Check if handle already exists
    const doc = await collection.findOne({
      handle: body.handle,
    });

    if (doc) {
      return Response.json(
        {
          success: false,
          error: true,
          message: "This Bittree already exists!",
          result: null,
        },
        {
          status: 200,
        }
      );
    }

    // Insert data
    const result = await collection.insertOne(body);

    console.log("Data inserted:", result);

    return Response.json(
      {
        success: true,
        error: false,
        message: "Your Bittree has been generated!",
        result: result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      {
        success: false,
        error: true,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}