const globalForMemory = global as unknown as {
  generationsMemory: Map<string, { status: string; resultUrl?: string; error?: string }>;
};

export const generationsMemory =
  globalForMemory.generationsMemory || new Map<string, { status: string; resultUrl?: string; error?: string }>();

if (process.env.NODE_ENV !== 'production') {
  globalForMemory.generationsMemory = generationsMemory;
}
