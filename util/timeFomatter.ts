export const getFormattedTime = (timestamp: number) => {
  // タイムスタンプをミリ秒に変換
  const date = new Date(timestamp * 1000);
  // 日本時間に変換し、"HH:mm"形式でフォーマット
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
    hour12: false, // 24時間表記
  });
};
