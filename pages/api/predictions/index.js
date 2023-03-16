const API_HOST = process.env.REPLICATE_API_HOST || "https://api.openai.com";
const API_PATH = process.env.REPLICATE_API_PATH || "v1/completions"

import packageData from "../../../package.json";

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.");
  }

  console.log("New request: ", req.body)
  
  // remnove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  const body = JSON.stringify({   
    max_tokens: 500, 
    model: "text-davinci-003",
    prompt: `Can you in less than 200 words give me a ${req.body.numDays} day itinerary in ${req.body.location}`
  });

  const headers = {
    Authorization: `${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": `${packageData.name}/${packageData.version}`
  }

  const response = await fetch(`${API_HOST}/${API_PATH}`, {
    method: "POST",
    headers,
    body,
  });

  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    console.log(error)
    res.end(JSON.stringify({ error: "some kind of error occured." }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 200;
  res.end(JSON.stringify(prediction));
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
