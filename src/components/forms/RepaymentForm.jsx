import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { Loader } from 'lucide-react';

const RepaymentForm = ({ customerId, loanId, onClose, remainingAmount }) => {
  const { addRepayment } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    note: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) > remainingAmount) {
      newErrors.amount = `Amount cannot exceed the remaining balance (₹${remainingAmount})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const repaymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    setLoading(true);
    try {
      await addRepayment(customerId, loanId, repaymentData);
      onClose();
    } catch (error) {
      console.error('Failed to add repayment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
          Repayment Amount (₹) *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          max={remainingAmount}
          step="any"
          className={`input ${errors.amount ? 'border-error' : ''}`}
        />
        {errors.amount && <p className="mt-1 text-sm text-error">{errors.amount}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          Remaining balance: ₹{remainingAmount}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="note" className="block text-sm font-medium text-foreground mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          name="note"
          rows="2"
          value={formData.note}
          onChange={handleChange}
          placeholder="Any additional information about this repayment"
          className="input"
        ></textarea>
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
              Processing...
            </span>
          ) : (
            'Record Repayment'
          )}
        </button>
      </div>
    </form>
  );
};

export default RepaymentForm;