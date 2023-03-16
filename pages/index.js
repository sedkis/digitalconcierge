import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";

import Footer from "components/footer";

import { getRandomSeed } from "lib/seeds";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const appName = "Raisin, Your Digital Concierge";
export const appSubtitle = "Plan a trip, with the help of an AI, Raisin.";
export const appMetaDescription = "Plan a trip, with the help of an AI.";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());
  const [step, setStep] = useState(1);
  const [tripDetails, setTripDetails] = useState({
    date: null,
    numDays: null,
    location: null
  });

  const handleSubmit = async (e) => {
    console.log(tripDetails)
    

    const userResponse = e.target.userInput.value;

    console.log("setting to: " + userResponse)
    console.log("in step: " + step)
    
    if (step == 1) {
      setTripDetails({
        ...tripDetails,
        date: userResponse
      });
    }
    else if (step == 2) {
      setTripDetails({
        ...tripDetails,
        numDays: userResponse
      });
    }
    else if (step == 3) {
      setTripDetails({
        ...tripDetails,
        location: userResponse
      });
    }

    // make a copy so that the second call to setEvents here doesn't blow away the first. Why?
    const myEvents = [...events, { userResponse, user: 'user' }];
    setEvents(myEvents);

    if (step != 3) {
      setStep(step + 1)
      return
    }

    setError(null);
    setIsProcessing(true);

    const body = {
      ...tripDetails,
      location: userResponse
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();

    if (response.status !== 200) {
      setError(prediction.detail);
      return;
    }

    console.log('yo my guy: ', prediction)

    setEvents(
      myEvents.concat([
        { userResponse: prediction.choices[0].text },
      ])
    );

    setIsProcessing(false);
  };

  return (
    <div>
      <Head>
        <title>{appName}</title>
        <meta name="description" content={appMetaDescription} />
        <meta property="og:title" content={appName} />
        <meta property="og:description" content={appMetaDescription} />
        <meta property="og:image" content="https://paintbytext.chat/opengraph.jpg" />
      </Head>

      <main className="container max-w-[700px] mx-auto p-5">
        <hgroup>
          <h1 className="text-center text-5xl font-bold m-6">{appName}</h1>
          <p className="text-center text-xl opacity-60 m-6">
            {appSubtitle}
          </p>
        </hgroup>

        <Messages
          events={events}
          isProcessing={isProcessing}
        />

        <PromptForm
          step={step}
          onSubmit={handleSubmit}
          disabled={isProcessing}
        />

        <div className="mx-auto w-full">
          {error && <p className="bold text-red-500 pb-5">{error}</p>}
        </div>

        <Footer
          events={events}
        />
      </main>
    </div>
  );
}
