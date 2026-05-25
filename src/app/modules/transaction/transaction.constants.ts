export enum TransactionReferenceType {
    Ride = 'Ride',
    Listing = 'Listing',
    Reservation = 'Reservation',
    Consultation = 'Consultation',
}

export enum TransactionGateway {
    Stripe = 'stripe',
    Chapa = 'chapa',
    Manual = 'manual',
}

export enum TransactionType {
    Payment = 'payment',
    Refund = 'refund',
    Payout = 'payout',
}

export enum TransactionStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
    Cancelled = 'cancelled',
}