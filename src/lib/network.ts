export async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip as string;
  } catch (error) {
    console.warn("Failed to fetch public IP, fallback to 127.0.0.1");
    return '127.0.0.1';
  }
}

export async function getIPInfo(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    return await response.json();
  } catch (error) {
    return { error: 'Failed to fetch IP details' };
  }
}
