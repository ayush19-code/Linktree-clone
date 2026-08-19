import clientPromise from "@/lib/mongodb";

export default async function Page({ params }) {
  const { handle } = await params;

  const client = await clientPromise;

  const db = client.db("bitlinks");
  const collection = db.collection("links");

  const data = await collection.findOne({
    handle: handle.toLowerCase(),
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Bittree not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9C0E9] flex justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center py-10">

        <img
          src={data.pic}
          alt={data.handle}
          className="w-24 h-24 rounded-full object-cover"
        />

        <h1 className="text-3xl font-bold mt-4">
          @{data.handle}
        </h1>

        <p className="mt-2 text-gray-700">
          {data.desc}
        </p>

        <div className="w-full mt-8 px-6">
          {data.links.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white rounded-full p-4 mb-4 text-center font-semibold hover:bg-gray-100"
            >
              {item.linktext}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}