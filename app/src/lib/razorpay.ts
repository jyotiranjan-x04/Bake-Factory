import Razorpay from "razorpay";

let razorpayClient: Razorpay | null = null;

function getClient() {
  if (razorpayClient) {
    return razorpayClient;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayClient;
}

type CreatePaymentLinkInput = {
  amount: number;
  description: string;
  customerName: string;
  customerPhone: string;
};

export async function createRazorpayPaymentLink(input: CreatePaymentLinkInput) {
  const client = getClient();

  if (!client) {
    return {
      id: `mock-payment-${Date.now()}`,
      short_url: `https://example.com/mock-payment/${Date.now()}`,
    };
  }

  return client.paymentLink.create({
    amount: input.amount * 100,
    currency: "INR",
    description: input.description,
    customer: {
      name: input.customerName,
      contact: input.customerPhone,
    },
    notify: {
      sms: true,
      email: false,
    },
    reminder_enable: true,
  });
}
