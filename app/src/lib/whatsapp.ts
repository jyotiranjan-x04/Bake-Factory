type WhatsAppResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export async function sendWhatsAppText(to: string, body: string): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  }

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: errorText,
    };
  }

  const data = (await response.json()) as {
    messages?: { id: string }[];
  };

  return {
    success: true,
    messageId: data.messages?.[0]?.id,
  };
}
