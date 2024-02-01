import { useRef } from 'react';
import {
  GenericNetworkTransaction,
  TransactionStatus,
  TxTag,
} from '@networkassociation/network-sdk/types';
import { NetworkTransactionBatch } from '@networkassociation/network-sdk/internal';
import { Id, toast } from 'react-toastify';
import { TransactionToast } from '~/components/NotificationToasts';

const useTransactionStatus = () => {
  const idRef = useRef<Id>(0);

  const handleStatusChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transaction: GenericPNetworkTransaction<any, any>,
    customId?: Id,
  ) => {
    const isTxBatch = transaction instanceof NetworkTransactionBatch;
    let tag: TxTag;

    if (isTxBatch) {
      tag = transaction.transactions[0].tag;
    } else {
      tag = transaction.tag;
    }

    switch (transaction.status) {
      case TransactionStatus.Unapproved:
        idRef.current = toast.info(
          <TransactionToast
            message="Please sign transaction in your wallet"
            tag={tag}
            isTxBatch={isTxBatch}
            batchSize={isTxBatch ? transaction.transactions.length : 0}
            status={transaction.status}
            timestamp={Date.now()}
          />,
          {
            autoClose: false,
            closeOnClick: false,
            containerId: 'notification-center',
            toastId: customId ?? idRef.current,
          },
        );

        break;

      case TransactionStatus.Running:
        toast.update(customId ?? idRef.current, {
          render: (
            <TransactionToast
              txHash={transaction.txHash}
              status={transaction.status}
              tag={tag}
              isTxBatch={isTxBatch}
              batchSize={isTxBatch ? transaction.transactions.length : 0}
              timestamp={Date.now()}
            />
          ),
          isLoading: true,
          autoClose: false,
          closeOnClick: false,
          containerId: 'notification-center',
        });
        break;
      case TransactionStatus.Succeeded:
        toast.update(customId ?? idRef.current, {
          render: (
            <TransactionToast
              txHash={transaction.txHash}
              status={transaction.status}
              tag={tag}
              isTxBatch={isTxBatch}
              batchSize={isTxBatch ? transaction.transactions.length : 0}
              timestamp={Date.now()}
            />
          ),
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: false,
          closeOnClick: false,
          containerId: 'notification-center',
        });
        break;
      case TransactionStatus.Rejected:
        toast.update(customId ?? idRef.current, {
          render: (
            <TransactionToast
              status={transaction.status}
              tag={tag}
              isTxBatch={isTxBatch}
              batchSize={isTxBatch ? transaction.transactions.length : 0}
              error="Transaction was rejected"
              timestamp={Date.now()}
            />
          ),
          type: toast.TYPE.WARNING,
          isLoading: false,
          autoClose: false,
          closeOnClick: false,
          containerId: 'notification-center',
        });
        break;

      case TransactionStatus.Failed:
        toast.update(customId ?? idRef.current, {
          render: (
            <TransactionToast
              txHash={transaction.txHash}
              status={transaction.status}
              tag={tag}
              isTxBatch={isTxBatch}
              batchSize={isTxBatch ? transaction.transactions.length : 0}
              error={transaction.error?.message}
              timestamp={Date.now()}
            />
          ),
          type: toast.TYPE.ERROR,
          isLoading: false,
          autoClose: false,
          closeOnClick: false,
          containerId: 'notification-center',
        });
        break;

      case TransactionStatus.Aborted:
        toast.update(customId ?? idRef.current, {
          render: (
            <TransactionToast
              status={transaction.status}
              tag={tag}
              isTxBatch={isTxBatch}
              batchSize={isTxBatch ? transaction.transactions.length : 0}
              error={transaction.error?.message}
              timestamp={Date.now()}
            />
          ),
          type: toast.TYPE.ERROR,
          isLoading: false,
          autoClose: false,
          closeOnClick: true,
          containerId: 'notification-center',
        });
        break;

      default:
        break;
    }
  };

  return { handleStatusChange };
};

export default useTransactionStatus;
