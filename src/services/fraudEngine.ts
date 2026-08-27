import { z } from 'zod';

export const FraudEventSchema = z.object({
  eventId: z.string(),
  actorId: z.string(),
  actionType: z.enum(["BIOMASS_SUBMISSION", "WALLET_WITHDRAWAL"]),
  anomalyScore: z.number().min(0).max(100),
  geotag: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  timestamp: z.date()
});

export const checkFraud = (eventData: any) => {
  const result = FraudEventSchema.safeParse(eventData);
  if (!result.success) {
    return { isFraud: true, reason: 'Invalid data schema' };
  }
  
  if (result.data.anomalyScore > 85) { 
    return { isFraud: true, reason: 'High anomaly score detected' };
  }
  return { isFraud: false };
};
