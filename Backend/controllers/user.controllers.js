import User from '../models/user.models.js';
import uploadOnCloudinary from '../config/cloudinary.js';
import gemeniResponse from '../gemini.js';
import moment from 'moment/moment.js';


export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        // Fetch user from database using userId
        const user = await User.findById(userId).select('-password');   // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Get current user error' });
    }
}


export const updateAssistant = async (req,res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }
        const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password");
        // console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: "Update assistant error" });
    }
}


export const askToAssistant = async (req, res) => {
    
    try {
        // console.log("askToAssistant called ✅");
        
        const { command } = req.body;
        
        const user = await User.findById(req.userId);
        // console.log("User found:", user?._id);


        const userName = user.name;
        const assistantName = user.assistantName;
        // console.log("UserName:", userName, "AssistantName:", assistantName);

        const result = await gemeniResponse(command, userName, assistantName);
        // console.log("Gemini raw result:", result);

        
        // Extract text safely
        let resultText;

        if (typeof result === "string") {
            resultText = result;
        } else if (result.response && typeof result.response.text === "function") {
            resultText = await result.response.text(); // Gemini SDK format
        } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            resultText = result.candidates[0].content.parts[0].text; // raw API format
        } else {
            console.error("❌ Unable to extract text from Gemini response");
            return res.status(500).json({ response: "Invalid Gemini response format" });
        }

        // console.log("Gemini text result:", resultText);

        const jsonMatch = resultText.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            console.log("No JSON found in gemini result ❌");
            return res.status(400).json({ response: "Sorry, I can't understand" });
        }

        // const jsonMatch = result.match(/{[\s\S]*}/);
        // console.log(jsonMatch);
        // if (!jsonMatch) {
        //     console.log("No JSON found in gemini result ❌");
        //     return res.status(400).json({ response: "Sorry, I can't understand" });
        // }

        const gemResult = JSON.parse(jsonMatch[0]);
        // console.log("Parsed gemResult:", gemResult);

        const type = gemResult.type;
        // console.log("Type:", type);

        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });
            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("MMMM")}`
                });
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });
            
            default:
                return res.status(400).json({ response: "I didn't understand that command." });
        }

    } catch (error) {
        return res.status(500).json({response: "Ask assistant error"})
    }
}