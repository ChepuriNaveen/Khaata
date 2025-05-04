// Generate dates relative to the current date for more realistic data
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setDate(nextMonth.getDate() + 30);

export const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    address: '123 Main St, City',
    createdAt: lastWeek.toISOString(),
    totalOutstanding: 850,
    loans: [
      {
        id: 'l1',
        item: 'Flour and Sugar',
        amount: 500,
        date: lastWeek.toISOString(),
        dueDate: nextWeek.toISOString(),
        remainingAmount: 300,
        status: 'active',
        repayments: [
          {
            id: 'r1',
            amount: 200,
            date: yesterday.toISOString(),
            note: 'Partial payment'
          }
        ]
      },
      {
        id: 'l2',
        item: 'Rice Bag',
        amount: 550,
        date: yesterday.toISOString(),
        dueDate: nextMonth.toISOString(),
        remainingAmount: 550,
        status: 'active',
        repayments: []
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '8765432109',
    address: '456 Elm St, Town',
    createdAt: (new Date(today.setMonth(today.getMonth() - 2))).toISOString(),
    totalOutstanding: 0,
    loans: [
      {
        id: 'l3',
        item: 'Groceries',
        amount: 300,
        date: lastWeek.toISOString(),
        dueDate: yesterday.toISOString(),
        remainingAmount: 0,
        status: 'paid',
        repayments: [
          {
            id: 'r2',
            amount: 300,
            date: yesterday.toISOString(),
            note: 'Full payment'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Robert Johnson',
    phone: '7654321098',
    address: '789 Oak St, Village',
    createdAt: (new Date(today.setMonth(today.getMonth() - 1))).toISOString(),
    totalOutstanding: 1500,
    loans: [
      {
        id: 'l4',
        item: 'Monthly Groceries',
        amount: 1500,
        date: lastWeek.toISOString(),
        dueDate: yesterday.toISOString(),
        remainingAmount: 1500,
        status: 'active',
        repayments: []
      }
    ]
  },
  {
    id: '4',
    name: 'Mary Williams',
    phone: '6543210987',
    address: '101 Pine St, Suburb',
    createdAt: (new Date(today.setDate(today.getDate() - 15))).toISOString(),
    totalOutstanding: 200,
    loans: [
      {
        id: 'l5',
        item: 'Vegetables',
        amount: 200,
        date: yesterday.toISOString(),
        dueDate: nextWeek.toISOString(),
        remainingAmount: 200,
        status: 'active',
        repayments: []
      }
    ]
  }
];