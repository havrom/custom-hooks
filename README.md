# custom-hooks (cryptocurrency project)

**useAssetTable** is a custom hook which wraps Tanstack React Table hook along with loading state and total items count. Tricky part with this particular table was to track: portfolio id, user identity as well as 3 separate table tabs - two of which use GraphQL queries to retrieve data and third one gets data from context. Table uses independent (basically correctly refreshable) pagination for each tab as well.

**useTransactionStatus** is a custom hook to enable/disable/update toast notifications based on transaction status on chain. It’s method handleStatusChange is used as a callback for sdk’s subscription method which provides it transaction data as an argument. This allows to dynamically update info inside running notification to keep user up do date with sensitive information hands on. 
Usage example in transaction: 
```typescript
const transferNetwork = async ({ amount, to, memo }: ITransfer) => {
    if (!sdk) return undefined;

    setTransactionInProcess(true);

    let unsubCb: UnsubCallback | null = null;

    try {
      const transferNetworkTx = await sdk.network.transferNetwork({
        amount: new BigNumber(amount),
        to,
        memo,
      });

      unsubCb = transferNetworkTx.onStatusChange(handleStatusChange);

      await transferNetworkTx.run();
    } catch (error) {
      notifyError((error as Error).message);
    } finally {
      setTransactionInProcess(false);
    }

    return () => (unsubCb ? unsubCb() : undefined);
  };
```
