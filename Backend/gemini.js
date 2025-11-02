import axios from "axios";


const gemeniResponse = async (prompt) => {
    try {
        const apiURL = process.env.GEMINI_API_URL;
        const result = await axios.post(
      apiURL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
        return result.data;
    } catch (error) {
        console.log(error);
    }
}

export default gemeniResponse;