import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mockCustomers } from '../data/mockData';

const CustomerContext = createContext();

export const useCustomer = () => {
  return useContext(CustomerContext);
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load customers (in a real application, this would be an API call)
    const fetchCustomers = () => {
      setLoading(true);
      setTimeout(() => {
        // Load from localStorage if available, otherwise use mock data
        const savedCustomers = localStorage.getItem('customers');
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        } else {
          setCustomers(mockCustomers);
          localStorage.setItem('customers', JSON.stringify(mockCustomers));
        }
        setLoading(false);
      }, 600);
    };

    fetchCustomers();
  }, []);

  // Save customers to localStorage whenever it changes
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  }, [customers]);

  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      loans: [],
      totalOutstanding: 0,
    };

    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    toast.success('Customer added successfully!');
    return newCustomer;
  };

  const getCustomer = (id) => {
    return customers.find((customer) => customer.id === id);
  };

  const addLoan = (customerId, loan) => {
    const newLoan = {
      ...loan,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      remainingAmount: loan.amount,
      repayments: [],
      status: 'active',
    };

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => {
        if (customer.id === customerId) {
          const updatedLoans = [...customer.loans, newLoan];
          const totalOutstanding = calculateTotalOutstanding(updatedLoans);
          
          return {
            ...customer,
            loans: updatedLoans,
            totalOutstanding,
          };
        }
        return customer;
      })
    );

    toast.success('Loan added successfully!');
    return newLoan;
  };

  const addRepayment = (customerId, loanId, repayment) => {
    const newRepayment = {
      ...repayment,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };

    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => {
        if (customer.id === customerId) {
          const updatedLoans = customer.loans.map((loan) => {
            if (loan.id === loanId) {
              const updatedRepayments = [...loan.repayments, newRepayment];
              const totalRepaid = updatedRepayments.reduce(
                (sum, rep) => sum + rep.amount,
                0
              );
              const remainingAmount = Math.max(0, loan.amount - totalRepaid);
              const status = remainingAmount <= 0 ? 'paid' : 'active';

              return {
                ...loan,
                repayments: updatedRepayments,
                remainingAmount,
                status,
              };
            }
            return loan;
          });

          const totalOutstanding = calculateTotalOutstanding(updatedLoans);

          return {
            ...customer,
            loans: updatedLoans,
            totalOutstanding,
          };
        }
        return customer;
      })
    );

    toast.success('Repayment recorded successfully!');
  };

  const calculateTotalOutstanding = (loans) => {
    return loans.reduce((total, loan) => total + loan.remainingAmount, 0);
  };

  const calculateDueStatus = (loan) => {
    if (loan.status === 'paid') {
      return 'paid';
    }

    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    
    if (dueDate < today) {
      return 'overdue';
    } else {
      return 'upcoming';
    }
  };

  const value = {
    customers,
    loading,
    addCustomer,
    getCustomer,
    addLoan,
    addRepayment,
    calculateDueStatus,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};