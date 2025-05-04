import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { Loader } from 'lucide-react';

const AddLoanForm = ({ customerId, onClose }) => {
  const { addLoan } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    amount: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  // Set default due date as 30 days from now
  useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const formattedDate = date.toISOString().substring(0, 10);
    setFormData(prev => ({
      ...prev,
      dueDate: formattedDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.item.trim()) {
      newErrors.item = 'Item description is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const loanData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    setLoading(true);
    try {
      await addLoan(customerId, loanData);
      onClose();
    } catch (error) {
      console.error('Failed to add loan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label htmlFor="item" className="block text-sm font-medium text-foreground mb-1">
          Item/Description *
        </label>
        <input
          type="text"
          id="item"
          name="item"
          value={formData.item}
          onChange={handleChange}
          placeholder="e.g., Rice, Sugar, Monthly Groceries"
          className={`input ${errors.item ? 'border-error' : ''}`}
        />
        {errors.item && <p className="mt-1 text-sm text-error">{errors.item}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
          Amount (₹) *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          step="any"
          className={`input ${errors.amount ? 'border-error' : ''}`}
        />
        {errors.amount && <p className="mt-1 text-sm text-error">{errors.amount}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
          Due Date *
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={`input ${errors.dueDate ? 'border-error' : ''}`}
        />
        {errors.dueDate && <p className="mt-1 text-sm text-error">{errors.dueDate}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Saving...
            </span>
          ) : (
            'Add Loan'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddLoanForm;