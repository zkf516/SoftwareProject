import articleMd from '../mock-data/article.md?raw';
import formatDateMd from '../mock-data/formatDate.md?raw';
import greenTheme from '../mock-data/greenTheme.md?raw';
import helpMd from '../mock-data/help.md?raw';
import quickSortMd from '../mock-data/quicksort.md?raw';
import type { IMessageAvatar } from '../types/type-chat-view';

export const introPromptCn = {
  direction: 'horizontal',
  list: [
    {
      value: 'feverCough',
      label: '我发烧38度，咳嗽三天了，是感冒还是肺炎？要不要去医院？',
      iconConfig: { name: 'icon-info-o', color: '#5e7ce0' },
      desc: '常见感冒与肺炎的初步判断与建议',
    },
    {
      value: 'checkupAbnormal',
      label: '体检报告说我“尿酸高”“脂肪肝”，这是不是得大病了？',
      iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
      desc: '体检异常指标的健康解读',
    },
    {
      value: 'insomniaHelp',
      label: '晚上总是睡不着，白天头晕，能不能不吃安眠药？',
      iconConfig: { name: 'icon-priority', color: '#3ac295' },
      desc: '失眠的非药物调理建议',
    },
    {
      value: 'drugInteraction',
      label: '我现在吃降压药，能不能同时吃布洛芬？会不会冲突？',
      iconConfig: { name: 'icon-warning', color: '#e06c75' },
      desc: '常见药物联用的注意事项',
    },
  ],
};
export const introPromptEn = {
  direction: 'horizontal',
  list: [
    {
      value: 'feverCough',
      label: 'I have a 38°C fever and cough for 3 days—cold, flu, or pneumonia? Should I go to the hospital?',
      iconConfig: { name: 'icon-info-o', color: '#5e7ce0' },
      desc: 'Initial advice for common cold vs. pneumonia',
    },
    {
      value: 'checkupAbnormal',
      label: 'My check-up says high uric acid & fatty liver—do I have a serious illness?',
      iconConfig: { name: 'icon-star', color: 'rgb(255, 215, 0)' },
      desc: 'Health interpretation of abnormal check-up results',
    },
    {
      value: 'insomniaHelp',
      label: 'I can’t sleep at night and feel dizzy all day—how can I avoid sleeping pills?',
      iconConfig: { name: 'icon-priority', color: '#3ac295' },
      desc: 'Non-drug advice for insomnia',
    },
    {
      value: 'drugInteraction',
      label: 'I’m on blood-pressure meds—can I safely take ibuprofen for pain?',
      iconConfig: { name: 'icon-warning', color: '#e06c75' },
      desc: 'Precautions for common drug combinations',
    },
  ],
};

export const guessQuestionsCn = [
  { label: '我发烧38度，咳嗽三天了，是感冒还是肺炎？要不要去医院？', value: 'feverCough' },
  { label: '体检报告说我“尿酸高”“脂肪肝”，这是不是得大病了？', value: 'checkupAbnormal' },
  { label: '晚上总是睡不着，白天头晕，能不能不吃安眠药？', value: 'insomniaHelp' },
  { label: '我现在吃降压药，能不能同时吃布洛芬？会不会冲突？', value: 'drugInteraction' },
];
export const guessQuestionsEn = [
  { label: 'I have a 38°C fever and cough for 3 days—cold, flu, or pneumonia? Should I go to the hospital?', value: 'feverCough' },
  { label: 'My check-up says high uric acid & fatty liver—do I have a serious illness?', value: 'checkupAbnormal' },
  { label: 'I can’t sleep at night and feel dizzy all day—how can I avoid sleeping pills?', value: 'insomniaHelp' },
  { label: 'I’m on blood-pressure meds—can I safely take ibuprofen for pain?', value: 'drugInteraction' },
];

export const mockAnswer = {
  quickSort: quickSortMd,
  theme: greenTheme,
  helpMd: helpMd,
  article: articleMd,
  formatDate: formatDateMd,
};

export const customerAvatar: IMessageAvatar = {
  imgSrc: 'https://matechat.gitcode.com/png/demo/userAvatar.svg',
  width: 32,
  height: 32,
};
export const aiModelAvatar: IMessageAvatar = {
  imgSrc: 'https://matechat.gitcode.com/logo.svg',
  width: 32,
  height: 32,
};
