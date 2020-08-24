import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private getTotalByType(type: 'income' | 'outcome'): number {
    const transactionsFilter = this.transactions.filter(
      transaction => transaction.type === type,
    );

    let total = 0;
    transactionsFilter.forEach(transaction => {
      total += transaction.value;
    });

    return total;
  }

  public getBalance(): Balance {
    const balance: Balance = {
      income: this.getTotalByType('income'),
      outcome: this.getTotalByType('outcome'),
      total: 0,
    };

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transation = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (transation.type === 'outcome' && balance.total < transation.value)
      throw Error();

    this.transactions.push(transation);

    return transation;
  }
}

export default TransactionsRepository;
