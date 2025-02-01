import { IapticOffer, IapticPricingPhase, IapticProduct, IapticRecurrenceMode } from "../types";
import { Locales } from "./Locales";

export type DurationISO = `P${number}${'D' | 'W' | 'M' | 'Y'}`;

export function isDurationISO(iso: string): iso is DurationISO {
  return /^P\d+[DWMY]$/.test(iso);
}

/**
 * Utility methods for users of the iaptic library.
 */
export class Utils {

  /**
   * Generate a localized version of the billing cycle in a pricing phase.
   * 
   * For supported languages, check {@link Locales}.
   *
   * Example outputs:
   *
   * - "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
   * - "for 1 year": for `NON_RECURRING`, period "P1Y"
   * - "every week": for `INFINITE_RECURRING, period "P1W"
   *
   * @example
   * ```typescript
   * IapticRN.utils.formatBillingCycle(offer.pricingPhases[0])
   * ```
   */
  formatBillingCycle(pricingPhase: IapticPricingPhase): string {
    if (!pricingPhase.billingPeriod || !isDurationISO(pricingPhase.billingPeriod)) {
      return '';
    }
    switch (this.fixedRecurrenceMode(pricingPhase)) {
      case "FINITE_RECURRING":
        return this.getBillingCycleTemplate(
          pricingPhase.billingCycles ?? 0,
          this.formatDuration(pricingPhase.billingPeriod, pricingPhase.billingCycles ?? 0)
        );
      case "NON_RECURRING":
        return this.getBillingCycleTemplateNonRecurring(
          pricingPhase.billingCycles ?? 0,
          this.formatDuration(pricingPhase.billingPeriod, pricingPhase.billingCycles ?? 0, true)
        );
      default:// INFINITE_RECURRING
        return this.getBillingCycleTemplateInfinite(
          pricingPhase.billingCycles ?? 0,
          this.formatDuration(pricingPhase.billingPeriod, pricingPhase.billingCycles ?? 0)
        );
    }
  }

  /**
   * FINITE_RECURRING with billingCycles=1 is like NON_RECURRING
   * FINITE_RECURRING with billingCycles=0 is like INFINITE_RECURRING
   */
  fixedRecurrenceMode(pricingPhase: IapticPricingPhase): IapticRecurrenceMode | undefined {
    const cycles = pricingPhase.billingCycles ?? 0;
    if (pricingPhase.recurrenceMode === "FINITE_RECURRING") {
      if (cycles == 1) return "NON_RECURRING";
      if (cycles <= 0) return "INFINITE_RECURRING";
    }
    return pricingPhase.recurrenceMode;
  }

  /**
   * Format a simple ISO 8601 duration to plain English.
   *
   * This works for non-composite durations, i.e. that have a single unit with associated amount. For example: "P1Y" or "P3W".
   *
   * See https://en.wikipedia.org/wiki/ISO_8601#Durations
   *
   * This method is provided as a utility for getting simple things done quickly. In your application, you'll probably
   * need some other method that supports multiple locales.
   *
   * @param iso - Duration formatted in IS0 8601
   * @return The duration in plain english. Example: "1 year" or "3 weeks".
   *
  formatDurationEN(iso?: string, options?: { omitOne?: boolean }): string {
    if (!iso) return '';
    const l = iso.length;
    const n = iso.slice(1, l - 1);
    if (n === '1') {
      if (options?.omitOne) {
        return ({ 'D': 'day', 'W': 'week', 'M': 'month', 'Y': 'year', }[iso[l - 1]]) || iso[l - 1];
      }
      else {
        return ({ 'D': '1 day', 'W': '1 week', 'M': '1 month', 'Y': '1 year', }[iso[l - 1]]) || iso[l - 1];
      }
    }
    else {
      const u = ({ 'D': 'days', 'W': 'weeks', 'M': 'months', 'Y': 'years', }[iso[l - 1]]) || iso[l - 1];
      return `${n} ${u}`;
    }
  }
  */

  // For billing cycles
  getBillingCycleTemplate(cycles: number, duration: string): string {
    return Locales.get('BillingCycle_Finite', [`${cycles}`, duration], '', ['cycles', 'duration']);
  }

  getBillingCycleTemplateNonRecurring(cycles: number, duration: string): string {
    return Locales.get('BillingCycle_NonRecurring', [`${cycles}`, duration], '', ['cycles', 'duration']);
  }

  getBillingCycleTemplateInfinite(cycles: number, duration: string): string {
    return Locales.get('BillingCycle_Infinite', [`${cycles}`, duration], '', ['cycles', 'duration']);
  }

  // For duration units
  formatDuration(iso: DurationISO, count: number, includeCount?: boolean): string {
    const l = iso.length;
    const isoCount = parseInt(iso.slice(1, -1));
    if (count === 0) {
      count = isoCount;
    }
    if (count > 1 && isoCount > 1) {
      count = isoCount * count;
    }
    const unit = iso[l - 1] as 'D' | 'W' | 'M' | 'Y';
    const units = Locales.getForCount(`Duration_${unit}`, count);
    if (includeCount) {
      return `${count} ${units}`;
    }
    return units;
  }

  /**
   * Format a currency amount from micros with proper localization
   * @param amountMicros - Amount in micros (1/1,000,000 of currency unit)
   * @param currency - ISO 4217 currency code (e.g., 'USD', 'EUR')
   * @returns Formatted currency string
   * @example
   * ```ts
   * Utils.formatCurrency(1990000, 'USD') // Returns "$1.99"
   * Utils.formatCurrency(1000000, 'EUR') // Returns "€1"
   * ```
   */
  formatCurrency(amountMicros: number, currency: string): string {
    if (typeof amountMicros !== 'number' || typeof currency !== 'string') {
      return '';
    }
    currency = currency.toUpperCase();

    try {
      const amount = amountMicros / 1000000;
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency
      }).format(amount).replace('.00', '');
    } catch (error) {
      // Fallback formatting for common currencies
      const amount = amountMicros / 1000000;

      const currencyFormats: Record<string, { symbol: string; position: 'before' | 'after' }> = {
        USD: { symbol: '$', position: 'before' },
        EUR: { symbol: '€', position: 'before' },
        GBP: { symbol: '£', position: 'before' },
        JPY: { symbol: '¥', position: 'before' },
        CNY: { symbol: '¥', position: 'before' },
        KRW: { symbol: '₩', position: 'before' },
        INR: { symbol: '₹', position: 'before' },
        RUB: { symbol: '₽', position: 'after' },
        BRL: { symbol: 'R$', position: 'before' },
        CHF: { symbol: 'CHF', position: 'before' },
        CAD: { symbol: 'CA$', position: 'before' },
        AUD: { symbol: 'A$', position: 'before' },
        NZD: { symbol: 'NZ$', position: 'before' },
        HKD: { symbol: 'HK$', position: 'before' },
        SGD: { symbol: 'S$', position: 'before' },
        SEK: { symbol: 'kr', position: 'after' },
        NOK: { symbol: 'kr', position: 'after' },
        DKK: { symbol: 'kr', position: 'after' },
        PLN: { symbol: 'zł', position: 'after' }
      };

      const format = currencyFormats[currency];
      if (format) {
        const formattedAmount = amount.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
        return (format.position === 'before'
          ? `${format.symbol}${formattedAmount}`
          : `${formattedAmount} ${format.symbol}`).replace('.00', '');
      }

      // Default fallback for unknown currencies
      return `${currency} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`.replace('.00', '');
    }
  }

  monthlyPriceMicros(offer: IapticOffer) {
    const firstPhase = offer.pricingPhases[0];
    const price = firstPhase.priceMicros;
    const period = firstPhase.billingPeriod;
    const unit = period?.slice(-1) ?? 'M';
    const quantity = parseInt(period?.slice(1, -1) ?? '1');
    switch (unit) {
      case 'M':
        return price / quantity;
      case 'Y':
        return price / (quantity * 12);
      case 'W':
        return price / (quantity * 4);
      case 'D':
        return price / (quantity * 365);
    }
    return price;
  }

  cheapestOffer(product: IapticProduct) {
    return product.offers.reduce((cheapest, offer) => {
      const monthlyPrice = this.monthlyPriceMicros(offer);
      if (monthlyPrice < this.monthlyPriceMicros(cheapest)) {
        return offer;
      }
      return cheapest;
    }, product.offers[0]);
  }
}

export const utils = new Utils();
