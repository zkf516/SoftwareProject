#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
图片Base64编码工具
功能：将图片文件转换为Base64编码字符串
"""

import os
import base64
import argparse


def encode_image_to_base64(image_path):
    """
    将图片文件转换为Base64编码字符串
    
    Args:
        image_path: 图片文件路径
    
    Returns:
        str: Base64编码后的字符串
    
    Raises:
        FileNotFoundError: 文件不存在
        IOError: 文件读取错误
        ValueError: 无效的文件类型
    """
    # 检查文件是否存在
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"图片文件不存在: {image_path}")
    
    # 检查文件类型
    allowed_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'}
    file_ext = os.path.splitext(image_path)[1].lower()
    if file_ext not in allowed_extensions:
        raise ValueError(f"不支持的文件类型: {file_ext}。支持的类型: {', '.join(allowed_extensions)}")
    
    # 读取图片并编码
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return encoded_string
    except IOError as e:
        raise IOError(f"读取图片文件时出错: {str(e)}")


def main():
    """
    主函数，处理命令行参数并执行编码
    """
    # 创建命令行参数解析器
    parser = argparse.ArgumentParser(description='将图片转换为Base64编码')
    parser.add_argument('--image_path', help='图片文件的路径')
    parser.add_argument('--data-url', '-d', action='store_true', 
                        help='输出完整的data URL格式（包含data:image/xxx;base64,前缀）')
    parser.add_argument('--output', '-o', help='将结果保存到指定文件，不指定则输出到控制台')
    
    # 解析命令行参数
    args = parser.parse_args()
    
    try:
        # 获取文件扩展名
        file_ext = os.path.splitext(args.image_path)[1].lower().replace('.', '')
        if file_ext == 'jpg':
            file_ext = 'jpeg'  # 标准MIME类型使用jpeg而非jpg
        
        # 执行编码
        base64_data = encode_image_to_base64(args.image_path)
        
        # 根据是否需要data URL格式构造输出
        if args.data_url:
            result = f"data:image/{file_ext};base64,{base64_data}"
        else:
            result = base64_data
        
        # 输出结果
        if args.output:
            try:
                with open(args.output, 'w', encoding='utf-8') as f:
                    f.write(result)
                print(f"Base64编码已保存到: {args.output}")
            except IOError as e:
                print(f"保存文件时出错: {str(e)}")
        else:
            print("===== Base64编码结果 =====")
            print(result)
            print("==========================")
            
    except Exception as e:
        print(f"错误: {str(e)}")
        parser.print_help()


if __name__ == '__main__':
    main()