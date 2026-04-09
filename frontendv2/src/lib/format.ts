export const formatUpdatedAt = (value: number) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value * 1000));
