import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { Translate } from '@google-cloud/translate/build/src/v2';
import axios from 'axios';

// 配置常量
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ENTRIES_PER_BATCH = 10; // 减少批次大小以提高稳定性
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 3000; // 增加延迟到3秒

// 解析SRT文件
interface SrtEntry {
  id: number;
  timeCode: string;
  text: string;
}

// 解析SRT文件内容
function parseSrt(content: string): SrtEntry[] {
  try {
    const lines = content.trim().split('\n');
    const entries: SrtEntry[] = [];
    
    let i = 0;
    while (i < lines.length) {
      // 跳过空行
      if (lines[i].trim() === '') {
        i++;
        continue;
      }
      
      // 解析字幕编号
      const id = parseInt(lines[i], 10);
      if (isNaN(id)) {
        i++;
        continue;
      }
      i++;
      
      // 解析时间码
      if (i >= lines.length) break;
      const timeCode = lines[i];
      i++;
      
      // 解析文本内容
      if (i >= lines.length) break;
      let text = '';
      while (i < lines.length && lines[i].trim() !== '') {
        text += (text ? '\n' : '') + lines[i];
        i++;
      }
      
      if (text.trim()) {
        entries.push({ id, timeCode, text: text.trim() });
      }
    }
    
    return entries;
  } catch (error) {
    console.error('解析SRT文件时出错:', error);
    throw new Error('SRT文件解析失败');
  }
}

// 将解析后的SRT条目重新组合为SRT文件内容
function formatSrt(entries: SrtEntry[]): string {
  return entries.map(entry => {
    return `${entry.id}\n${entry.timeCode}\n${entry.text}\n`;
  }).join('\n');
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 重试包装函数
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = MAX_RETRIES, delayMs: number = 3000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`API调用失败，${delayMs}ms后重试 (${attempt}/${maxRetries})`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // 指数退避，但最小延迟为3秒
      const backoffDelay = Math.max(delayMs * Math.pow(2, attempt - 1), 3000);
      console.log(`等待 ${backoffDelay}ms 后重试...`);
      await delay(backoffDelay);
    }
  }
  throw new Error('重试次数已用完');
}

// 使用Google翻译API
async function translateWithGoogle(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    console.log(`开始Google翻译: "${text.substring(0, 50)}..." -> ${targetLanguage}`);
    
    // 自动检测源语言
    const detectedLang = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
    console.log(`Google翻译语言对: ${detectedLang} -> ${targetLanguage} (检测到: ${detectedLang})`);
    
    const translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY || '',
    });

    const [translation] = await translate.translate(text, {
      from: detectedLang,
      to: targetLanguage,
    });

    console.log(`Google翻译完成: "${text.substring(0, 30)}..." -> "${translation.substring(0, 30)}..."`);
    return translation;
  } catch (error) {
    console.error('Google翻译错误:', error);
    throw new Error(`Google翻译服务出错: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 使用OpenAI翻译API
async function translateWithOpenAI(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    console.log(`开始OpenAI翻译: "${text.substring(0, 50)}..." -> ${targetLanguage}`);
    
    // 自动检测源语言
    const detectedLang = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
    console.log(`OpenAI翻译语言对: ${detectedLang} -> ${targetLanguage} (检测到: ${detectedLang})`);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译专家。请将以下${detectedLang === 'zh' ? '中文' : detectedLang === 'ar' ? '阿拉伯语' : detectedLang === 'ja' ? '日语' : detectedLang === 'ko' ? '韩语' : detectedLang === 'ru' ? '俄语' : '英文'}文本翻译成${targetLanguage === 'zh' ? '中文' : targetLanguage === 'en' ? '英文' : targetLanguage === 'ja' ? '日语' : targetLanguage === 'ko' ? '韩语' : targetLanguage === 'ar' ? '阿拉伯语' : targetLanguage === 'ru' ? '俄语' : targetLanguage}。请保持原文的语气和风格，只返回翻译结果，不要添加任何解释。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const translatedText = completion.choices[0]?.message?.content || text;
    console.log(`OpenAI翻译完成: "${text.substring(0, 30)}..." -> "${translatedText.substring(0, 30)}..."`);
    return translatedText;
  } catch (error) {
    console.error('OpenAI翻译错误:', error);
    throw new Error(`OpenAI翻译服务出错: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 检测文本语言
function detectLanguage(text: string): string {
  // 阿拉伯语检测
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (arabicRegex.test(text)) {
    return 'ar';
  }
  
  // 中文检测
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/;
  if (chineseRegex.test(text)) {
    return 'zh';
  }
  
  // 日文检测
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
  if (japaneseRegex.test(text)) {
    return 'ja';
  }
  
  // 韩文检测
  const koreanRegex = /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/;
  if (koreanRegex.test(text)) {
    return 'ko';
  }
  
  // 俄文检测
  const russianRegex = /[\u0400-\u04FF]/;
  if (russianRegex.test(text)) {
    return 'ru';
  }
  
  // 默认返回英语
  return 'en';
}

// 使用MyMemory免费翻译API
async function translateWithMyMemory(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  try {
    console.log(`开始MyMemory翻译: "${text.substring(0, 50)}..." -> ${targetLanguage}`);
    
    // 自动检测源语言
    const detectedLang = sourceLanguage === 'auto' ? detectLanguage(text) : sourceLanguage;
    const langPair = `${detectedLang}|${targetLanguage}`;
    
    console.log(`MyMemory语言对: ${langPair} (检测到: ${detectedLang})`);
    
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: langPair,
      },
      timeout: 20000, // 增加到20秒超时
    });

    console.log('MyMemory API响应状态:', response.status);

    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      const translatedText = response.data.responseData.translatedText;
      console.log(`MyMemory翻译完成: "${text.substring(0, 30)}..." -> "${translatedText.substring(0, 30)}..."`);
      return translatedText;
    } else {
      console.error('MyMemory返回无效数据:', response.data);
      throw new Error('MyMemory翻译服务返回无效数据');
    }
  } catch (error) {
    console.error('MyMemory翻译错误:', error);
    
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error('MyMemory翻译服务网络超时');
    }
    
    throw new Error(`MyMemory翻译服务出错: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 批量翻译字幕条目
async function translateBatch(
  entries: SrtEntry[],
  translationService: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<SrtEntry[]> {
  console.log(`开始批量翻译，共${entries.length}条字幕，每批${MAX_ENTRIES_PER_BATCH}条`);
  const results: SrtEntry[] = [];
  
  for (let i = 0; i < entries.length; i += MAX_ENTRIES_PER_BATCH) {
    const batch = entries.slice(i, i + MAX_ENTRIES_PER_BATCH);
    console.log(`处理批次 ${Math.floor(i/MAX_ENTRIES_PER_BATCH) + 1}/${Math.ceil(entries.length/MAX_ENTRIES_PER_BATCH)}，包含${batch.length}条字幕`);
    
    // 并行处理批次内的条目
    const batchResults = await Promise.all(
      batch.map(async (entry, index) => {
        try {
          console.log(`开始翻译条目 ${i + index + 1}/${entries.length}: ID=${entry.id}`);
          let translatedText: string;
          
          // 根据选择的翻译服务进行翻译
          switch (translationService) {
            case 'google':
              translatedText = await withRetry(() => 
                translateWithGoogle(entry.text, sourceLanguage, targetLanguage)
              );
              break;
            case 'openai':
              translatedText = await withRetry(() => 
                translateWithOpenAI(entry.text, sourceLanguage, targetLanguage)
              );
              break;
            case 'mymemory':
              translatedText = await withRetry(() => 
                translateWithMyMemory(entry.text, sourceLanguage, targetLanguage)
              );
              break;
            default:
              throw new Error('不支持的翻译服务');
          }
          
          console.log(`条目 ${i + index + 1} 翻译完成`);
          return {
            ...entry,
            text: translatedText
          };
        } catch (error) {
          console.error(`翻译错误 (ID: ${entry.id}):`, error);
          // 如果翻译失败，保留原文并添加错误标记
          return {
            ...entry,
            text: `[翻译失败] ${entry.text}`
          };
        }
      })
    );
    
    results.push(...batchResults);
    console.log(`批次 ${Math.floor(i/MAX_ENTRIES_PER_BATCH) + 1} 完成，已处理 ${results.length}/${entries.length} 条字幕`);
    
    // 批次间延迟，避免API速率限制
    if (i + MAX_ENTRIES_PER_BATCH < entries.length) {
      console.log(`等待 ${RATE_LIMIT_DELAY}ms 后处理下一批次...`);
      await delay(RATE_LIMIT_DELAY);
      console.log(`延迟结束，继续处理下一批次`);
    } else {
      console.log('这是最后一个批次，无需延迟');
    }
  }
  
  console.log(`批量翻译完成，共处理 ${results.length} 条字幕`);
  console.log(`处理结果统计: 成功=${results.filter(r => !r.text.includes('[翻译失败]')).length}, 失败=${results.filter(r => r.text.includes('[翻译失败]')).length}`);
  return results;
}

// 处理翻译请求
export async function POST(request: NextRequest) {
  console.log('API路由被调用');
  const startTime = Date.now();
  
  // 检查环境变量
  console.log('环境变量检查:');
  console.log('GOOGLE_TRANSLATE_API_KEY:', process.env.GOOGLE_TRANSLATE_API_KEY ? '已配置' : '未配置');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '已配置' : '未配置');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  try {
    // 检查请求方法
    if (request.method !== 'POST') {
      return NextResponse.json({ error: '只支持POST请求' }, { status: 405 });
    }

    console.log('开始处理POST请求');
    
    // 解析multipart/form-data请求
    let formData;
    try {
      formData = await request.formData();
      console.log('FormData解析成功');
    } catch (error) {
      console.error('解析FormData失败:', error);
      return NextResponse.json({ error: '请求格式错误' }, { status: 400 });
    }

    // 获取表单数据
    const file = formData.get('file') as File;
    const translationService = formData.get('translationService') as string;
    const sourceLanguage = formData.get('sourceLanguage') as string;
    const targetLanguage = formData.get('targetLanguage') as string;

    console.log('表单数据:', {
      fileName: file?.name,
      fileSize: file?.size,
      translationService,
      sourceLanguage,
      targetLanguage
    });

    // 验证必要参数
    if (!file) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    if (!translationService) {
      return NextResponse.json({ error: '缺少翻译服务' }, { status: 400 });
    }

    if (!targetLanguage) {
      return NextResponse.json({ error: '缺少目标语言' }, { status: 400 });
    }

    // 验证文件类型
    if (!file.name.toLowerCase().endsWith('.srt')) {
      return NextResponse.json({ error: '只支持.srt格式文件' }, { status: 400 });
    }

    console.log('文件验证通过，开始读取文件内容');

    // 读取文件内容
    let fileContent: string;
    try {
      fileContent = await file.text();
      console.log('文件内容读取成功，长度:', fileContent.length);
    } catch (error) {
      console.error('读取文件内容失败:', error);
      return NextResponse.json({ error: '读取文件失败' }, { status: 500 });
    }

    // 解析SRT文件
    let srtEntries;
    try {
      srtEntries = parseSrt(fileContent);
      console.log('SRT解析成功，条目数:', srtEntries.length);
    } catch (error) {
      console.error('SRT解析失败:', error);
      return NextResponse.json({ error: 'SRT文件格式无效' }, { status: 400 });
    }

    if (srtEntries.length === 0) {
      return NextResponse.json({ error: 'SRT文件为空' }, { status: 400 });
    }

    console.log('开始翻译处理，使用服务:', translationService);

    // 批量翻译字幕条目
    const translatedEntries = await translateBatch(
      srtEntries,
      translationService,
      sourceLanguage,
      targetLanguage
    );

    console.log(`翻译完成，共处理 ${translatedEntries.length} 条字幕`);

    // 生成输出内容
    const outputContent = formatSrt(translatedEntries);

    console.log('返回翻译结果，设置响应头');
    
    const processingTime = Date.now() - startTime;
    console.log('返回翻译结果，设置响应头');
    
    // 返回翻译后的内容
    return new NextResponse(outputContent, {
      headers: {
        'Content-Type': 'text/srt',
        'Content-Disposition': `attachment; filename="translated_${file.name}"`,
        'X-Processing-Time': processingTime.toString(),
        'X-Entries-Count': translatedEntries.length.toString(),
        'Content-Length': outputContent.length.toString(),
      },
    });

  } catch (error) {
    console.error('API处理过程中发生错误:', error);
    
    // 返回详细的错误信息
    return NextResponse.json({ 
      error: '处理翻译请求时出错',
      message: error instanceof Error ? error.message : '未知错误',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    }, { status: 500 });
  }
}
