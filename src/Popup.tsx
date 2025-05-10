import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import leetcode from "@/assets/leetcode.png";
import {
    Select,
    SelectGroup,
    SelectItem,
    SelectContent,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { VALID_MODELS, ValidModel } from "@/constants/valid_models";
import { useChromeStorage } from "@/hooks/useChromeStorage";

const Popup: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>("");
    const [model, setModel] = useState<ValidModel | undefined>(undefined);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<{
        state: "error" | "success";
        message: string;
    } | null>(null);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [activeModel, setAciveModel] = useState<string>("");

    const { getSelectedModel, getkeyAndModel, setKeyAndModel, setSelectedModel } =
        useChromeStorage();

    useEffect(() => {
        const loadChromeStorage = async () => {
            if (typeof chrome === "undefined" || !chrome.storage) return;

            try {
                const m = await getSelectedModel();
                if (m) {
                    const { apiKey } = await getkeyAndModel(m);
                    setModel(m);
                    setAciveModel(m);
                    setApiKey(apiKey || "");
                }
            } catch (error) {
                console.error("Failed to load from Chrome storage:", error);
                setSubmitMessage({
                    state: "error",
                    message: "Failed to load saved settings",
                });
            }
        };

        loadChromeStorage();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsloading(true);
            if (!apiKey || !model) {
                throw new Error("API key and model selection are required");
            }

            await setKeyAndModel(apiKey, model);

            setSubmitMessage({
                state: "success",
                message: "API key saved successfully",
            });
        } catch (error) {
            console.log(error);
            setSubmitMessage({
                state: "error",
                message: "Failed to save settings",
            });
        } finally {
            setIsloading(false);
        }
    };

    const handleSelect = (model: ValidModel) => {
        try {
            if (model) {
                console.log("Selected model:", model);
                setSelectedModel(model);
                setAciveModel(model);
                setModel(model);
            }
        } catch (error) {
            console.error("Failed to set selected model:", error);
            setSubmitMessage({
                state: "error",
                message: "Failed to set selected model",
            });
        }
    };

    return (
        <div className="p-4 w-xs overflow-hidden bg-white">
            <div className="text-center">
                <div className="flex items-center justify-center">
                    <img src={leetcode} alt="image" className="w-12 h-12 object-cover" />
                    <h1 className="text-lg font-semibold text-gray-800 ml-2">LeetAid</h1>
                </div>
                <p className="mt-1 text-gray-600 text-xs mx-3">
                    LeetAid provides you tailored hints to the problems you are solving on LeetCode.
                </p>
            </div>

            <div>
                <form onSubmit={(e) => handleSubmit(e)} className="mt-8 space-y-6">
                    <div className="space-y-0.5">
                        <label
                            htmlFor="input"
                            className="block text-sm font-medium text-gray-700 ml-1"
                        >
                            Select Model
                        </label>
                        <Select
                            onValueChange={(value: ValidModel) => handleSelect(value)}
                            value={activeModel}
                            required
                        >
                            <SelectTrigger className="w-full text-xs">
                                <SelectValue placeholder="Select a Model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Models</SelectLabel>
                                    {VALID_MODELS.map((model) => (
                                        <SelectItem key={model.name} value={model.name}>
                                            {model.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative space-y-0.5">
                        <label
                            htmlFor="input"
                            className="block text-sm font-medium text-gray-700 ml-1"
                        >
                            Api Key
                        </label>
                        <Input
                            required
                            disabled={!model}
                            onChange={(e) => setApiKey(e.target.value)}
                            value={apiKey}
                            type={showPassword ? "text" : "password"}
                            id={showPassword ? "text" : "password"}
                            placeholder="Enter Api Key"
                            className="pr-10"
                        />
                        <button
                            type="button"
                            disabled={!model}
                            className="absolute top-[34px] right-4 cursor-pointer z-50 disable:opacity-70 disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowPassword(!showPassword);
                            }}
                        >
                            {showPassword ? (
                                <EyeOff size={16} color="#6b7280" />
                            ) : (
                                <Eye size={16} color="#6b7280" />
                            )}
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={!model || isLoading}
                            className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-md hover:opacity-90 w-full shadow cursor-pointer active:scale-95 transition-transform duration-200 ease-in-out disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            <span>Submit</span>
                        </button>
                    </div>
                </form>
            </div>

            {submitMessage && (
                <div
                    className={`text-center mt-2 w-full p-2 rounded-md border ${
                        submitMessage.state === "success"
                            ? "bg-green-50 text-green-600 border-green-500"
                            : "bg-red-50 text-red-600 border-red-500"
                    }`}
                >
                    <p className="text-sm">{submitMessage.message}</p>
                </div>
            )}

            <div className="mt-2 flex items-center justify-center">
                <p className="text-xs">Want more features?&nbsp;</p>
                <a
                    href="https://github.com/TahirIqbal095/LeetAid/issues/new"
                    className="text-blue-500 text-xs hover:underline"
                    target="_blank"
                >
                    Request for feature
                </a>
            </div>
        </div>
    );
};

export default Popup;
