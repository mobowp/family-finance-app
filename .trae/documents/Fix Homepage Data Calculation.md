I will fix the issues with the homepage data display, specifically the monthly income/expense calculation and the total wealth calculation.

1. **Fix Date Range for Monthly Stats**:

   * Modify `app/page.tsx` to correctly calculate the start and end of the month.

   * Use `startOfMonth` as the 1st day of the current month at 00:00:00.

   * Use `endOfMonth` as the 1st day of the *next* month at 00:00:00.

   * Update the Prisma query to use `gte: startOfMonth` and `lt: endOfMonth` to ensure all transactions in the current month (including the last day) are covered.

2. **Refine Total Wealth Calculation**:

   * Update the `totalWealth` calculation to handle `CREDIT` accounts correctly.

   * Subtract the balance of `CREDIT` accounts (assuming positive balance means debt) from the total.

   * Add the balance of non-`CREDIT` accounts.

3. **Refine Asset Distribution Chart**:

   * Exclude `CREDIT` accounts from the asset distribution chart if they represent debt (positive balance).

   * Ensure only positive asset values are displayed in the chart.

This will ensure that:

* Transactions on the last day of the month are included.

* Credit card debt is correctly subtracted from total wealth.

* The asset distribution chart reflects actual assets, not debts.

