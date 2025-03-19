import { Products } from '#types/products'

export type PaymentSessionID = string

export enum PaymentSessionStatus {
  Pending = 'pending',
  Paid = 'paid',
  Canceled = 'canceled',
}

export interface Invoice {
  invoiceUrl: string
}

export class PaymentSession {
  id: PaymentSessionID
  status: PaymentSessionStatus
  url: string | null
  products: Products | null
  invoice: Invoice | null

  constructor(id: PaymentSessionID, status: PaymentSessionStatus) {
    this.id = id
    this.status = status
    this.url = null
    this.products = null
    this.invoice = null
  }

  public setUrl(url: string | null): PaymentSession {
    this.url = url
    return this
  }

  public setProducts(products: Products): PaymentSession {
    this.products = products
    return this
  }

  public setInvoice(invoice: Invoice | null) {
    this.invoice = invoice
    return this
  }

  public assertUrlIsValid(): asserts this is PaymentSession & { url: string } {
    if (this.url === null) throw new Error('PaymentSession URL is invalid or missing')
  }

  public assertProducts(): asserts this is PaymentSession & { products: Products } {
    if (this.products === null) throw new Error('PaymentSession has no products')
  }
}
