import type { LLMModelsConfig } from "./types";
import DeepSeekIcon from "../../public/deepseek-color.svg";
import QwenIcon from "../../public/qwen.svg";

export const MODEL_CONFIGS = {
  stream: true,
  enableMock: false,
};

export enum LLMProviders {
  SILICON_FLOW = "siliconflow",
  DEEP_SEEK = "deepseek",
  QWEN = "qwen",
}

export enum LLMClientKey {
  openai = "openai",
}

export const LLM_MODELS: LLMModelsConfig[] = [
  {
    // Qwen
    providerKey: LLMProviders.QWEN,
    apiPath: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: "sk-9c01fc7d757e45619045bfadaea8b249",
    models: [
      { name: "qwen-plus", iconPath: QwenIcon },
    ],
    available: true,
    clientKey: LLMClientKey.openai,
  },
  {
    // deepseek
    providerKey: LLMProviders.DEEP_SEEK,
    apiPath: "https://api.deepseek.com",
    apiKey: "sk-eee534b0912b429db2ee8592af329650",
    models: [
      { name: "deepseek-chat", iconPath: DeepSeekIcon },
      { name: "deepseek-reasoner", iconPath: DeepSeekIcon },
    ],
    available: true,
    clientKey: LLMClientKey.openai,
  },
];
