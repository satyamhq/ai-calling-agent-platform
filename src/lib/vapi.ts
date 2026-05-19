export const vapi = {
  async createAssistant(data: any) {
    const res = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create Vapi assistant');
    return res.json();
  },
  
  async initiateCall(assistantId: string, customerNumber: string, phoneNumberId?: string) {
    const res = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId,
        customer: { number: customerNumber },
        phoneNumberId
      })
    });
    if (!res.ok) throw new Error('Failed to initiate Vapi call');
    return res.json();
  }
};
