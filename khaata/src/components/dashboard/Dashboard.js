import React, { useContext } from "react";
import styled from "styled-components";
import { CustomerContext } from "../../context/CustomerContext";
import X from './X';

const Dashboard = () => {
  const { customers } = useContext(CustomerContext);

  return (
    <DashboardContainer>
      <h1>Customer Dashboard</h1>
      <CustomerList>
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </CustomerList>
    </DashboardContainer>
  );
};

const CustomerCard = ({ customer }) => {
  const isOverdue = new Date(customer.nextDueDate) < new Date();

  return (
    <Card isOverdue={isOverdue}>
      <h3>{customer.name}</h3>
      <p>Outstanding Balance: ₹{customer.outstandingBalance}</p>
      <p>Next Due Date: {customer.nextDueDate}</p>
      <Status isOverdue={isOverdue}>
        {isOverdue ? "Overdue" : "Up-to-date"}
      </Status>
    </Card>
  );
};

export default Dashboard;