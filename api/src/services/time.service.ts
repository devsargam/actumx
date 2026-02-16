export abstract class TimeService {
  static nowIso(): string {
    return new Date().toISOString();
  }

  static futureIso(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  static dollarsFromCents(amountCents: number): string {
    return (amountCents / 100).toFixed(2);
  }
}
