import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Search, UserPlus, DollarSign, TrendingUp, Users, 
  Calendar, AlertTriangle, CheckCircle, Clock 
} from 'lucide-react';
import AddCustomerForm from '../components/forms/AddCustomerForm';

const DashboardPage = () => {
  const { customers, loading, calculateDueStatus } = useCustomer();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.totalOutstanding, 0);
  
  const overdueLoans = customers.flatMap(customer => 
    customer.loans.filter(loan => 
      calculateDueStatus(loan) === 'overdue' && loan.status === 'active'
    )
  );

  const upcomingDueLoans = customers.flatMap(customer => 
    customer.loans.filter(loan => 
      calculateDueStatus(loan) === 'upcoming' && loan.status === 'active'
    )
  );

  const getStatusBadge = (customer) => {
    const hasOverdue = customer.loans.some(loan => 
      calculateDueStatus(loan) === 'overdue' && loan.status === 'active'
    );
    
    if (hasOverdue) {
      return (
        <span className="badge badge-error">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </span>
      );
    } else if (customer.totalOutstanding === 0) {
      return (
        <span className="badge badge-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Cleared
        </span>
      );
    } else {
      return (
        <span className="badge badge-outline">
          <Clock className="h-3 w-3 mr-1" />
          Active
        </span>
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {currentUser.name}</h1>
        <p className="text-muted-foreground">{currentUser.shopName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary/90 to-primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-foreground/80 mb-1">Total Outstanding</p>
              <h3 className="text-3xl font-bold text-primary-foreground">₹{totalOutstanding.toLocaleString()}</h3>
            </div>
            <div className="bg-primary-foreground/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-error/90 to-error">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-error-foreground/80 mb-1">Overdue Loans</p>
              <h3 className="text-3xl font-bold text-error-foreground">{overdueLoans.length}</h3>
            </div>
            <div className="bg-error-foreground/20 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-error-foreground" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-secondary/90 to-secondary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-secondary-foreground/80 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-secondary-foreground">{customers.length}</h3>
            </div>
            <div className="bg-secondary-foreground/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Upcoming Dues</h2>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          {upcomingDueLoans.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No upcoming dues</p>
          ) : (
            <div className="space-y-3">
              {upcomingDueLoans.slice(0, 5).map(loan => {
                const customer = customers.find(c => c.loans.some(l => l.id === loan.id));
                return (
                  <div 
                    key={loan.id} 
                    className="flex justify-between items-center p-3 bg-secondary rounded-md border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">{customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{loan.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{loan.remainingAmount}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              {upcomingDueLoans.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{upcomingDueLoans.length - 5} more
                </p>
              )}
            </div>
          )}
        </div>

        <div className="md:w-1/2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Overdue Loans</h2>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          {overdueLoans.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No overdue loans</p>
          ) : (
            <div className="space-y-3">
              {overdueLoans.slice(0, 5).map(loan => {
                const customer = customers.find(c => c.loans.some(l => l.id === loan.id));
                return (
                  <div 
                    key={loan.id} 
                    className="flex justify-between items-center p-3 bg-error/10 rounded-md border border-error/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{loan.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{loan.remainingAmount}</p>
                      <p className="text-sm text-error">
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              {overdueLoans.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{overdueLoans.length - 5} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Customers</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-md"
            onClick={() => setShowAddCustomer(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {filteredCustomers.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Try a different search term or' : 'Get started by adding your first customer'}
              </p>
              <button
                className="btn btn-primary btn-md"
                onClick={() => setShowAddCustomer(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-border rounded-lg">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Outstanding
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id}
                      className="hover:bg-secondary/40 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{customer.phone}</div>
                        <div className="text-xs text-muted-foreground">{customer.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          ₹{customer.totalOutstanding.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(customer)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAddCustomer && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Add New Customer</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowAddCustomer(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AddCustomerForm onClose={() => setShowAddCustomer(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;