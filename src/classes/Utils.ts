import { IapticPricingPhase, IapticRecurrenceMode } from "../types";

export class Utils {
    /**
     * Generate a plain english version of the billing cycle in a pricing phase.
     *
     * Example outputs:
     *
     * - "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
     * - "for 1 year": for `NON_RECURRING`, period "P1Y"
     * - "every week": for `INFINITE_RECURRING, period "P1W"
     *
     * @example
     * Utils.formatBillingCycleEN(offer.pricingPhases[0])
     */
    formatBillingCycleEN(pricingPhase: IapticPricingPhase): string {
      switch (this.fixedRecurrenceMode(pricingPhase)) {
        case "FINITE_RECURRING":
          return `${pricingPhase.billingCycles}x ${this.formatDurationEN(pricingPhase.billingPeriod)}`;
        case "NON_RECURRING":
          return 'for ' + this.formatDurationEN(pricingPhase.billingPeriod);
        default:// INFINITE_RECURRING
          return 'every ' + this.formatDurationEN(pricingPhase.billingPeriod, { omitOne: true });
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
     */
    formatDurationEN(iso?: string, options?: {omitOne?: boolean}): string {
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
  }
  