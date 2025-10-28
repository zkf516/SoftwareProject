import json

from qwen_agent.llm.schema import ContentItem, Message
from qwen_agent.llm import BaseChatModel
from qwen_agent.agents.fncall_agent import FnCallAgent
from qwen_agent.settings import MAX_LLM_CALL_PER_RUN
from qwen_agent.tools import BaseTool
from qwen_agent.utils.utils import format_as_text_message, merge_generate_cfgs

TOOL_DESCRIPTION = (
    '{name_for_model}：这是 {name_for_human} API。'
    '作用：{description_for_model}。'
    '所需参数：{parameters}。'
    '调用示例：{args_format}'
)

PROMPT_REACT = """
你是一个智能助手，使用 ReAct 框架完成任务。你可以访问以下工具：
{tool_descs}

当前用户输入：
{query}

你的输出必须严格遵循以下格式，每一步都必须包含 Thought 或 Action 或 Observation：
1. **Thought**：详细推理过程，至少包含：
   - 用户的目标
   - 我已知的信息
   - 还缺的信息
   - 下一步计划
2. **Action**：选择一个工具（名称必须在[{tool_names}]中）
3. **Action Input**：JSON 格式的工具参数
4. **Observation**：工具返回结果
5. 循环思考并调用工具，直到可以给出最终答案
6. **Final Answer**：最终回答用户

示例：
Question: 我想拨打 13912345678
Thought: 用户想打电话到 13912345678。
已知：我有 validate_phone_number 工具可以校验号码，phone_call_handler 工具可以拨号。
缺少：需要确认号码是否合法。
计划：先调用 validate_phone_number 检查号码。
Action: validate_phone_number
Action Input: {{"phone_number": "13912345678"}}
Observation: {{"valid": true}}
Thought: 号码合法，可以拨打。
Action: phone_call_handler
Action Input: {{"phone_number": "13912345678"}}
Observation: {{"status": "success", "detail": "电话已拨打"}}
Thought: 电话拨打成功。
Final Answer: 已拨打 13912345678

Question: {query}
Thought:
"""