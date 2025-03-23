export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const response = await fetch("https://pratyush770.pythonanywhere.com/api/get_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      });
  
      const data = await response.json();
      // res.status(200).json({year: data.year, response: data.response});
      res.status(200).json({response: data.response});
    } catch (error) {
      console.error("Error fetching response from Flask:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  