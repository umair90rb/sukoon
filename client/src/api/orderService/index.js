import Ajax from 'api/ajax';

class OrderService extends Ajax {
  pathname = 'order';

  fetchAllOrder = (data) => this.post(`${this.pathname}/all`, data);

  fetchOrder = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchUpdateStatusOrder = (data) => this.post(`${this.pathname}/status`, data);
  fetchAssignOrders = (data) => this.post(`${this.pathname}/assign`, data);

  fetchCreateOrder = (data) => this.post(`${this.pathname}`, data);

  fetchBookOrder = (data) => this.post(`${this.pathname}/book`, data);

  fetchImportOrder = (data) => this.post(`${this.pathname}/import`, data, { 'Content-Type': 'multipart/form-data' });

  fetchUpdateOrder = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteOrder = (id) => this.delete(`${this.pathname}/${id}`);
}

export const orderService = new OrderService();
