import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

interface Charge {
  description: string;
  amount: number | null;
}

@Component({
  selector: 'app-manual-invoice',
  templateUrl: './manual-invoice.component.html',
  styleUrls: ['./manual-invoice.component.css'],
})
export class ManualInvoiceComponent {
  childName = '';
  parentName = '';
  charges: Charge[] = [{ description: '', amount: null }];
  invoiceNumber = '';
  invoiceDate = '';
  billingPeriodStart = '';
  billingPeriodEnd = '';
  validationMessage = '';
  statusMessage = '';

  get invoiceTotal(): number {
    return this.charges.reduce(
      (total, charge) => total + (charge.amount ?? 0),
      0,
    );
  }

  addCharge(): void {
    this.charges.push({ description: '', amount: null });
  }

  removeCharge(index: number): void {
    this.charges.splice(index, 1);
  }

  clearMessages(): void {
    this.validationMessage = '';
    this.statusMessage = '';
  }

  downloadPdf(): void {
    const charges = this.validateInvoice();
    if (!charges) {
      return;
    }

    this.createPdf(charges).save(this.pdfFileName);
  }

  async sendAsEmail(): Promise<void> {
    const charges = this.validateInvoice();
    if (!charges) {
      return;
    }

    const pdf = this.createPdf(charges);
    const file = new File([pdf.output('blob')], this.pdfFileName, {
      type: 'application/pdf',
    });

    if (
      typeof navigator.share !== 'function' ||
      typeof navigator.canShare !== 'function' ||
      !navigator.canShare({ files: [file] })
    ) {
      pdf.save(this.pdfFileName);
      this.statusMessage =
        'This browser cannot share PDF attachments. The invoice was downloaded; attach it to an email manually.';
      return;
    }

    try {
      await navigator.share({
        files: [file],
        title: `Invoice ${this.invoiceNumber.trim()}`,
        text: `Invoice for ${this.childName.trim()}`,
      });
      this.statusMessage = 'Invoice shared.';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      this.validationMessage =
        'Could not open the share sheet. Download the invoice and attach it to an email manually.';
    }
  }

  private validateInvoice(): Array<Charge & { amount: number }> | null {
    this.clearMessages();
    const enteredCharges = this.charges.filter(
      (charge) => charge.description.trim() || charge.amount !== null,
    );
    const validCharges = enteredCharges.filter(
      (charge): charge is Charge & { amount: number } =>
        Boolean(charge.description.trim()) &&
        charge.amount !== null &&
        Number.isFinite(charge.amount),
    );

    if (!this.childName.trim() || !this.parentName.trim()) {
      this.validationMessage = 'Enter both the child and parent names.';
      return null;
    }

    if (
      !this.invoiceNumber.trim() ||
      !this.invoiceDate ||
      !this.billingPeriodStart ||
      !this.billingPeriodEnd
    ) {
      this.validationMessage =
        'Enter the invoice number, invoice date, and billing period.';
      return null;
    }

    if (this.billingPeriodStart > this.billingPeriodEnd) {
      this.validationMessage =
        'The billing period end date must be on or after the start date.';
      return null;
    }

    if (
      enteredCharges.length === 0 ||
      validCharges.length !== enteredCharges.length
    ) {
      this.validationMessage =
        'Add a description and a positive amount for each charge.';
      return null;
    }

    return validCharges;
  }

  private createPdf(charges: Array<Charge & { amount: number }>): jsPDF {
    const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const money = (amount: number): string => `$${amount.toFixed(2)}`;

    pdf.setFillColor(46, 125, 50);
    pdf.rect(0, 0, pageWidth, 16, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('SKYHIGH DAYCARE', 15, 10.5);

    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(24);
    pdf.text('INVOICE', pageWidth - 15, 31, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`Invoice number: ${this.invoiceNumber.trim()}`, 15, 28);
    pdf.text(`Invoice date: ${this.invoiceDate}`, 15, 35);
    pdf.text(
      `Period: ${this.billingPeriodStart} to ${this.billingPeriodEnd}`,
      15,
      42,
    );

    pdf.setDrawColor(229, 231, 235);
    pdf.line(15, 51, pageWidth - 15, 51);
    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('BILL TO', 15, 62);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Child: ${this.childName.trim()}`, 15, 70);
    pdf.text(`Parent: ${this.parentName.trim()}`, 15, 77);

    const tableLeft = 15;
    const tableRight = pageWidth - 15;
    let y = 91;

    const drawTableHeader = (): void => {
      pdf.setFillColor(243, 244, 246);
      pdf.rect(tableLeft, y, tableRight - tableLeft, 11, 'F');
      pdf.setTextColor(55, 65, 81);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('CHARGES', tableLeft + 4, y + 7);
      pdf.text('AMOUNT', tableRight - 4, y + 7, { align: 'right' });
      y += 11;
    };

    drawTableHeader();
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    for (const charge of charges) {
      const descriptionLines = pdf.splitTextToSize(
        charge.description.trim(),
        tableRight - tableLeft - 52,
      ) as string[];
      const rowHeight = Math.max(12, descriptionLines.length * 5 + 6);

      if (y + rowHeight > pageHeight - 24) {
        pdf.addPage();
        y = 20;
        drawTableHeader();
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
      }

      pdf.setTextColor(75, 85, 99);
      pdf.text(descriptionLines, tableLeft + 4, y + 7);
      pdf.text(money(charge.amount), tableRight - 4, y + 7, {
        align: 'right',
      });
      pdf.setDrawColor(229, 231, 235);
      pdf.line(tableLeft, y + rowHeight, tableRight, y + rowHeight);
      y += rowHeight;
    }

    if (y + 18 > pageHeight - 15) {
      pdf.addPage();
      y = 20;
    }

    pdf.setTextColor(17, 24, 39);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('TOTAL', tableRight - 50, y + 10);
    pdf.text(money(this.invoiceTotal), tableRight - 4, y + 10, {
      align: 'right',
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Thank you.', 15, pageHeight - 15);

    return pdf;
  }

  private get pdfFileName(): string {
    const safeInvoiceNumber = this.invoiceNumber
      .trim()
      .replace(/[^a-z0-9]+/gi, '-');
    return `invoice-${safeInvoiceNumber}.pdf`;
  }
}
