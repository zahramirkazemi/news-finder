const dateFormat = (date: Date | string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: 'h24'
  }).format(new Date(date));

export default dateFormat;
