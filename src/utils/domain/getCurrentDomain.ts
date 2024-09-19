export const currentDomain = () => {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  } else {
    return `https://localhost:3000`;
  }
};
