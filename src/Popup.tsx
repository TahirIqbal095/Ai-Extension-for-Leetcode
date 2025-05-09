import React, { useState } from "react";
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
import { useChromeStorage } from "./hooks/useChromeStorage";

const Popup: React.FC = () => {
    const [apiKey, setApiKey] = React.useState<string>("");
    const [model, setModel] = React.useState<ValidModel | null>(null);
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = React.useState<{
        state: "error" | "success";
        message: string;
    } | null>(null);
    const [isLoading, setIsloading] = useState<boolean>(false);

    React.useEffect(() => {
        const loadChromeStorage = async () => {
            if (!chrome) return;

            const { getSelectedModel, getkeyAndModel } = useChromeStorage();
            const m = await getSelectedModel();
            const { apiKey } = await getkeyAndModel(m);
            setModel(m);
            setApiKey(apiKey);
        };

        loadChromeStorage();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsloading(true);
            const { setKeyAndModel } = useChromeStorage();
            if (apiKey && model) {
                await setKeyAndModel(apiKey, model);
            }

            setSubmitMessage({
                state: "success",
                message: "Api key saved successfully",
            });
        } catch (error: any) {
            setSubmitMessage({
                state: "error",
                message: error.message,
            });
        } finally {
            setIsloading(false);
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
                            className="block text-sm font-medium text-gray-600 ml-1"
                        >
                            Select Model
                        </label>
                        <Select
                            onValueChange={(value: ValidModel) => setModel(value)}
                            value={model as ValidModel}
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
                            className="block text-sm font-medium text-gray-600 ml-1"
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
                            disabled={isLoading}
                            className="absolute top-8 right-4 cursor-pointer z-50"
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
                            className="px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-md hover:opacity-90 w-full shadow cursor-pointer active:scale-95 transition-transform duration-200 ease-in-out"
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
