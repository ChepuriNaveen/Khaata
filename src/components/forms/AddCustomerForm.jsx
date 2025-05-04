import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { Loader } from 'lucide-react';

const AddCustomerForm = ({ onClose }) => {
  const { addCustomer } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await addCustomer(formData);
      onClose();
    } catch (error) {
      console.error('Failed to add customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Customer Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? 'border-error' : ''}`}
        />
        {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone Number *
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`input ${errors.phone ? 'border-error' : ''}`}
        />
        {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          className={`input ${errors.address ? 'border-error' : ''}`}
        ></textarea>
        {errors.address && <p className="mt-1 text-sm text-error">{errors.address}</p>}
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
            'Add Customer'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;