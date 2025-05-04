import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

export const generatePDF = (customer) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      
      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(41, 98, 255); // Primary color
      doc.text('CrediKhaata', 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Customer Statement', 105, 25, { align: 'center' });
      
      // Add customer details
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Customer Information:', 14, 45);
      
      doc.setFontSize(10);
      doc.text(`Name: ${customer.name}`, 14, 52);
      doc.text(`Phone: ${customer.phone}`, 14, 58);
      doc.text(`Address: ${customer.address}`, 14, 64);
      doc.text(`Outstanding Amount: ₹${customer.totalOutstanding.toLocaleString()}`, 14, 70);
      
      // Add loan details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Loan Summary:', 14, 80);
      
      // Create loan table
      const loanHeaders = [
        'Item', 
        'Date', 
        'Amount', 
        'Repaid', 
        'Remaining', 
        'Due Date',
        'Status'
      ];
      
      const loanData = customer.loans.map(loan => {
        const dueDate = new Date(loan.dueDate).toLocaleDateString();
        const status = loan.status === 'paid' 
          ? 'Paid' 
          : new Date(loan.dueDate) < new Date() && loan.status === 'active'
            ? 'Overdue'
            : 'Active';
            
        return [
          loan.item,
          new Date(loan.date).toLocaleDateString(),
          `₹${loan.amount}`,
          `₹${(loan.amount - loan.remainingAmount).toFixed(2)}`,
          `₹${loan.remainingAmount}`,
          dueDate,
          status
        ];
      });
      
      doc.autoTable({
        head: [loanHeaders],
        body: loanData,
        startY: 85,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 98, 255],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Item
          1: { cellWidth: 20 }, // Date
          2: { cellWidth: 20 }, // Amount
          3: { cellWidth: 20 }, // Repaid
          4: { cellWidth: 20 }, // Remaining
          5: { cellWidth: 20 }, // Due Date
          6: { cellWidth: 20 }, // Status
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didDrawCell: (data) => {
          // Highlight overdue cells
          if (data.column.index === 6 && data.cell.raw === 'Overdue') {
            doc.setTextColor(220, 38, 38); // Red color for overdue
          } else if (data.column.index === 6 && data.cell.raw === 'Paid') {
            doc.setTextColor(34, 197, 94); // Green color for paid
          } else {
            doc.setTextColor(0, 0, 0); // Default black
          }
        },
      });
      
      // Add repayment details for each loan
      let yPos = doc.lastAutoTable.finalY + 15;
      
      customer.loans.forEach(loan => {
        if (loan.repayments.length > 0) {
          // Move to next page if not enough space
          if (yPos > 250) {
            doc.addPage();
            yPos = 15;
          }
          
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Repayment History for: ${loan.item}`, 14, yPos);
          
          const repaymentHeaders = ['Date', 'Amount', 'Note'];
          const repaymentData = loan.repayments.map(repayment => [
            new Date(repayment.date).toLocaleDateString(),
            `₹${repayment.amount}`,
            repayment.note || '-'
          ]);
          
          doc.autoTable({
            head: [repaymentHeaders],
            body: repaymentData,
            startY: yPos + 5,
            styles: {
              fontSize: 8,
              cellPadding: 2,
            },
            headStyles: {
              fillColor: [100, 116, 139],
              textColor: [255, 255, 255],
            },
            columnStyles: {
              0: { cellWidth: 30 }, // Date
              1: { cellWidth: 30 }, // Amount
              2: { cellWidth: 60 }, // Note
            },
          });
          
          yPos = doc.lastAutoTable.finalY + 15;
        }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          'This is a computer generated statement and does not require a signature.',
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          105,
          doc.internal.pageSize.height - 5,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`${customer.name.replace(/\s+/g, '_')}_Statement.pdf`);
      
      toast.success('Statement exported successfully!');
      resolve();
    } catch (error) {
      toast.error('Failed to generate PDF statement');
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};