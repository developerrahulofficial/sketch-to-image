// app/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [sketch, setSketch] = useState<File | null>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSketch(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketchPreview(reader.result as string); // Show preview of the uploaded sketch
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!sketch) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', sketch);

      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // Replace with your model version ID
          input: { image: sketch },
        },
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setGeneratedImage(response.data.output);
    } catch (error) {
      console.error("Error generating image", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-auto p-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl p-6 md:p-8 lg:p-12 max-w-md md:max-w-lg lg:max-w-2xl w-full text-white space-y-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4 tracking-tight">AI Sketch to Image Generator</h2>
        
        <p className="text-center text-gray-300 mb-6 text-sm md:text-base lg:text-lg">
          Transform your sketches into realistic images with the power of AI.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <label className="w-full cursor-pointer flex flex-col items-center py-4 md:py-5 lg:py-6 bg-gray-700/20 hover:bg-gray-700/30 transition rounded-lg border border-gray-500/30">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm md:text-base">Click to upload a sketch</span>
          </label>
          
          {sketchPreview && (
            <div className="w-full mt-4">
              <p className="text-center text-gray-400 mb-2">Uploaded Sketch Preview:</p>
              <img
                src={sketchPreview}
                alt="Sketch Preview"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain rounded-lg shadow-lg mx-auto"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!sketch || loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform transform ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span>Generating...</span>
              </div>
            ) : (
              "Generate Image"
            )}
          </button>
          
          {generatedImage && (
            <div className="mt-8 bg-white/10 p-4 md:p-6 rounded-lg shadow-lg border border-white/10 transition-transform transform hover:scale-105">
              <p className="text-center text-gray-400 mb-2">Generated Realistic Image:</p>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
