import { notification } from 'antd';

import { CURRENT_CONFIG_VERSION, Migration } from '@/migrations';
import { ConfigFile } from '@/types/exportConfig';

export const exportConfigFile = (config: object, fileName?: string) => {
  const file = `LobeChat-${fileName || '-config'}-v${CURRENT_CONFIG_VERSION}.json`;

  // 创建一个 Blob 对象
  const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });

  // 创建一个 URL 对象，用于下载
  const url = URL.createObjectURL(blob);

  // 创建一个 <a> 元素，设置下载链接和文件名
  const a = document.createElement('a');
  a.href = url;
  a.download = file;

  // 触发 <a> 元素的点击事件，开始下载
  document.body.append(a);
  a.click();

  // 下载完成后，清除 URL 对象
  URL.revokeObjectURL(url);
  a.remove();
};

export const importConfigFile = (info: any, onConfigImport: (config: ConfigFile) => void) => {
  const reader = new FileReader();
  //读取完文件之后的回调函数
  reader.onloadend = function (evt) {
    const fileString = evt.target?.result;
    const fileJson = fileString as string;

    try {
      const config = JSON.parse(fileJson);
      const { state } = Migration.migrate(config);

      onConfigImport({ ...config, state });
    } catch (error) {
      notification.error({
        description: `出错原因: ${(error as Error).message}`,
        message: '导入失败',
      });
    }
  };
  //@ts-ignore file 类型不明确
  reader.readAsText(info.file.originFileObj, 'utf8');
};