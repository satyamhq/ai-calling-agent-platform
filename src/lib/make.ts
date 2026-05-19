export const triggerMakeWebhook = async (webhookUrl: string, payload: any) => {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Make.com webhook failed:', error);
  }
};
