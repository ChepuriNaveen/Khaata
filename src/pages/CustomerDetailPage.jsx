import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { 
  ArrowLeft, PlusCircle, Download, AlertTriangle, CheckCircle, 
  Clock, DollarSign, FileText, X, Phone, Mail, MapPin 
} from 'lucide-react';
import AddLoanForm from '../components/forms/AddLoanForm';
import RepaymentForm from '../components/forms/RepaymentForm';
import { generatePDF } from '../utils/pdf';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const { getCustomer, calculateDueStatus } = useCustomer();
  const customer = getCustomer(id);
  const [showAddLoanForm, setShowAddLoanForm] = useState(false);
  const [showRepaymentForm, setShowRepaymentForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Customer not found</h2>
        <Link to="/" className="text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleAddRepayment = (loan) => {
    setSelectedLoan(loan);
    setShowRepaymentForm(true);
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      await generatePDF(customer);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (loan) => {
    if (loan.status === 'paid') {
      return (
        <span className="badge badge-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Paid
        </span>
      );
    }
    
    const status = calculateDueStatus(loan);
    
    if (status === 'overdue') {
      return (
        <span className="badge badge-error">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </span>
      );
    } else {
      return (
        <span className="badge badge-outline">
          <Clock className="h-3 w-3 mr-1" />
          Due {new Date(loan.dueDate).toLocaleDateString()}
        </span>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Link to="/" className="text-primary hover:text-primary/80 flex items-center text-sm mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{customer.name}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGeneratePDF}
            disabled={loading}
            className="btn btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </button>
          <button
            onClick={() => setShowAddLoanForm(true)}
            className="btn btn-primary"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-foreground">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-foreground">{customer.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Customer Since</p>
                <p className="text-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-primary/10 border-primary/20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Outstanding Balance</h2>
              <p className="text-muted-foreground text-sm mb-3">Total amount to be collected</p>
              <p className="text-3xl font-bold text-primary">₹{customer.totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Total Loans</p>
              <p className="text-foreground font-medium">{customer.loans.length}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Active Loans</p>
              <p className="text-foreground font-medium">
                {customer.loans.filter(loan => loan.status === 'active').length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Paid Loans</p>
              <p className="text-foreground font-medium">
                {customer.loans.filter(loan => loan.status === 'paid').length}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Overdue Loans</p>
              <p className="text-error font-medium">
                {customer.loans.filter(loan => 
                  loan.status === 'active' && calculateDueStatus(loan) === 'overdue'
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Loan History</h2>
        
        {customer.loans.length === 0 ? (
          <div className="text-center py-10 bg-card border border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No loans yet</h3>
            <p className="text-muted-foreground mb-6">This customer doesn't have any recorded loans</p>
            <button
              className="btn btn-primary btn-md"
              onClick={() => setShowAddLoanForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add First Loan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {customer.loans.map((loan) => (
              <div 
                key={loan.id} 
                className={`card ${
                  loan.status === 'paid' 
                    ? 'bg-success/5 border-success/20'
                    : calculateDueStatus(loan) === 'overdue'
                    ? 'bg-error/5 border-error/20'
                    : ''
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{loan.item}</h3>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(loan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>{getStatusBadge(loan)}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Original Amount</p>
                        <p className="text-foreground font-medium">₹{loan.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Repaid</p>
                        <p className="text-foreground font-medium">
                          ₹{(loan.amount - loan.remainingAmount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className={`font-medium ${
                          loan.remainingAmount > 0 ? 'text-foreground' : 'text-success'
                        }`}>
                          ₹{loan.remainingAmount}
                        </p>
                      </div>
                    </div>
                    
                    {loan.repayments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Repayment History</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {loan.repayments.map((repayment) => (
                            <div 
                              key={repayment.id} 
                              className="text-sm p-2 bg-secondary rounded flex justify-between"
                            >
                              <div>
                                <p>{new Date(repayment.date).toLocaleDateString()}</p>
                                {repayment.note && (
                                  <p className="text-xs text-muted-foreground">{repayment.note}</p>
                                )}
                              </div>
                              <p className="font-medium">₹{repayment.amount}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {loan.status === 'active' && (
                    <div className="flex md:flex-col justify-end gap-2 md:min-w-[120px]">
                      <button
                        onClick={() => handleAddRepayment(loan)}
                        className="btn btn-primary btn-sm"
                        disabled={loan.remainingAmount <= 0}
                      >
                        Record Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Loan Modal */}
      {showAddLoanForm && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Add New Loan</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowAddLoanForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AddLoanForm 
              customerId={customer.id} 
              onClose={() => setShowAddLoanForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Add Repayment Modal */}
      {showRepaymentForm && selectedLoan && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Record Repayment</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowRepaymentForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <RepaymentForm 
              customerId={customer.id}
              loanId={selectedLoan.id}
              remainingAmount={selectedLoan.remainingAmount}
              onClose={() => setShowRepaymentForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;