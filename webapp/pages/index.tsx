import { ExternalProvider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { GreeterFactory } from "../types/ethers-contracts";

const greeterContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

type GreeterFormFields = {
  newGreeting: string;
};

const GreeterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GreeterFormFields>();

  const [connectedProvider, setConnectedProvider] =
    useState<ExternalProvider>();
  const [greeting, setGreeting] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const connectWallet = async () => {
    const p = await detectEthereumProvider();
    if (p) {
      setConnectedProvider(p as ExternalProvider);
    }
  };

  const fetchGreeting = useCallback(async () => {
    if (connectedProvider) {
      const provider = new ethers.providers.Web3Provider(connectedProvider);
      const contract = GreeterFactory.connect(greeterContractAddress, provider);
      try {
        const data = await contract.greet();
        setGreeting(data);
      } catch (error) {
        alert("Something went wrong, check the console");
        console.error("error: ", error);
      }
    }
  }, [connectedProvider]);

  useEffect(() => {
    fetchGreeting();
  }, [fetchGreeting]);

  const setNewGreeting = async (newGreeting: string) => {
    if (!newGreeting) return;
    if (connectedProvider) {
      const provider = new ethers.providers.Web3Provider(connectedProvider);
      const signer = provider.getSigner();
      const contract = GreeterFactory.connect(greeterContractAddress, signer);
      const transaction = await contract.setGreeting(newGreeting);
      await transaction.wait();
      await fetchGreeting();
    }
  };

  const handleFormSubmission = handleSubmit(async (data) => {
    setIsSubmittingForm(true);
    await setNewGreeting(data.newGreeting);
    reset();
    setIsSubmittingForm(false);
  });

  return (
    <section>
      <div>
        <form onSubmit={handleFormSubmission} autoComplete="off">
          <div>
            <h1>Greeter</h1>
            <button
              type="button"
              onClick={connectWallet}
              disabled={!!connectedProvider}
            >
              {connectedProvider ? "Wallet Connected" : "Connect Wallet"}
            </button>
          </div>
          <fieldset disabled={!connectedProvider}>
            <div>Current greeting: {greeting}</div>
            <label>
              <span>
                New greeting <br />
              </span>
              <input
                {...register("newGreeting", {
                  required: { value: true, message: "This field is required" },
                })}
                placeholder="Input new greeting"
              />
            </label>
            <button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? "Processing..." : "Set New Greeting"}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
};

export default GreeterPage;
