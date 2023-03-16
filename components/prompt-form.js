import { useEffect, useState } from "react";
import Message from "./message";

export default function PromptForm({
  step,
  onSubmit,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    setInputValue("");
  };

  let prompt, inputType;
  switch (step) {
    case 1:
      prompt = "What is the date of your travel?";
      inputType = "text";
      break;
    case 2:
      prompt = "How many days are you traveling for?";
      inputType = "number";
      break;
    case 3:
      prompt = "Where are you traveling to?";
      inputType = "text";
      break;
  }

  if (disabled) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <Message sender="replicate" isSameSender>
        <label htmlFor="prompt-input">{prompt}</label>
      </Message>

      <div className="flex mt-8">
        <input
          id="prompt-input"
          type={inputType}
          name="userInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your answer..."
          className={`block w-full flex-grow${
            disabled ? " rounded-md" : " rounded-l-md"
          }`}
          disabled={disabled}
        />

        {disabled || (
          <button
            className="bg-black text-white rounded-r-md text-small inline-block p-3 flex-none"
            type="submit"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}