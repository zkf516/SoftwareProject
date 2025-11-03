from qwen_agent.tools import BaseTool
from qwen_agent.agents import Assistant
from qwen_agent.llm.schema import ContentItem, Message
import json5
import json
import os

class OCRTool(BaseTool):
    # 该工具用于解析图片病历，并提取文字内容
    name = 'ocr'
    description = '用于识别图片病历中的文本，将文本内容返回。'
    parameters = [
        {
            'name': 'image_path',
            'type': 'string',
            'description': '图片文件的本地路径',
            'required': True
        }
    ]

    def call(self, params: str) -> str:
        try:
            # 解析参数
            params = json5.loads(params)
            
            # 获取并验证文件路径
            image_path = params.get('image_path', '')
            if not image_path:
                return json.dumps({'error': '缺少图片文件路径参数'}, ensure_ascii=False)
            
            # 检查文件是否存在
            if not os.path.exists(image_path):
                return json.dumps({'error': '指定的图片文件不存在'}, ensure_ascii=False)
            
            query = f'请识别图片中的文本内容，直接返回文本'

            # 创建助手
            assistant = Assistant(llm={'model': 'qwen-vl-max'})

            # 发送消息
            # 构建消息，直接使用文件路径
            content = [
                ContentItem(image=image_path),
                ContentItem(text=query) if query else None
            ]
            # 过滤掉None值
            content = [item for item in content if item is not None]
            
            messages = [Message('user', content)]
            # 发送消息
            response = assistant.run(messages)
            
            # 处理generator类型的响应
            response_list = list(response)  # 转换generator为列表
            if response_list:
                # 分析响应结构并提取内容
                # qwen-vl-max的响应结构可能与之前版本不同
                try:
                    # 尝试不同的响应结构解析方式
                    if isinstance(response_list[-1], list) and len(response_list[-1]) > 0:
                        last_response = response_list[-1][-1].get('content', '')
                    elif isinstance(response_list[-1], dict):
                        last_response = response_list[-1].get('content', '')
                    else:
                        # 尝试将整个响应转换为字符串
                        last_response = str(response_list)
                    
                    return json.dumps({'status': 'success', 'content': last_response}, ensure_ascii=False)
                except Exception as parse_error:
                    return json.dumps({'status': 'error', 'message': f'解析响应失败: {str(parse_error)}'}, ensure_ascii=False)
            else:
                return json.dumps({'status': 'error', 'message': 'OCR 识别失败，未返回内容'}, ensure_ascii=False)
            
        except Exception as e:
            return json.dumps({'status': 'error', 'message': str(e)}, ensure_ascii=False)
    
