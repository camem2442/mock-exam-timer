interface CopyToClipboardResult {
  success: boolean;
  method: 'clipboard' | 'fallback';
  error?: string;
}

export const copyToClipboard = async (text: string): Promise<CopyToClipboardResult> => {
  // 빈 텍스트 체크
  if (!text) {
    return {
      success: false,
      method: 'clipboard',
      error: '복사할 텍스트가 없습니다.'
    };
  }

  // 1. 먼저 Clipboard API 시도
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        method: 'clipboard'
      };
    } catch (err) {
      console.warn('Clipboard API 실패, fallback 시도:', err);
    }
  }

  // 2. Clipboard API 실패 시 textarea fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return {
        success: true,
        method: 'fallback'
      };
    } else {
      throw new Error('execCommand 복사 실패');
    }
  } catch (err) {
    return {
      success: false,
      method: 'fallback',
      error: '클립보드 복사에 실패했습니다. 수동으로 복사해주세요.'
    };
  }
};