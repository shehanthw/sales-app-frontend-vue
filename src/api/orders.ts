import api from "./api";

export const postOrder = async (value: any) => {
  try {
    await api.post("/orders", value);
  } catch (err) {
    console.error("Failed to save order" + err);
    throw err;
  }
};

export const getOrderById = async (id: string) => {
  try {
    return await api.get(`/orders/${id}`);
  } catch (err) {
    console.error("Failed to fetch order");
    throw err;
  }
};

export const getAllOrders = async () => {
  try {
    return await api.get(`/orders`);
  } catch (err) {
    console.error("Failed to fetch order");
    throw err;
  }
};

export const getProductsByOrderId = async (id: string) => {
  try {
    return await api.get(`/orders/items/${id}`);
  } catch (err) {
    console.error("Failed to fetch products by order id");
    throw err;
  }
};

export const getCollectionsByOrderIdOrSellerID = async (id: string) => {
  try {
    return await api.get(`/orders/collection/${id}`);
  } catch (err) {
    console.error("Failed to fetch products by order id");
    throw err;
  }
};

export const collectInstallmentById = async (id: string) => {
  try {
    return await api.patch(`/orders/installments/${id}/collect`);
  } catch (err) {
    console.error("Failed to collect installment");
    throw err;
  }
};

export const getInstallmentsByDueDate = async (startDate: string, endDate: string, status: string) => {

  const processedString = `start_date=${startDate}&end_date=${endDate}&installment_status=${status}`
  try {
    return await api.get(`/orders/collections/by-due-date?${processedString}`);
  } catch (err) {
    console.error("Failed to collect installment");
    throw err;
  }
};

export const getInstallmentsByCollectorAndDueDate = async (startDate: string, endDate: string, status: string, collectorId: string) => {

  const processedString = `start_date=${startDate}&end_date=${endDate}&installment_status=${status}&collector_id=${collectorId}`
  try {
    return await api.get(`/orders/collections/by-due-date?${processedString}`);
  } catch (err) {
    console.error("Failed to collect installment");
    throw err;
  }
};


export const getOverdueInstallments = async (collectorId: string = "") => {
  let processedString = "/"

  collectorId ? processedString = `?collector_id=${collectorId}` : ''

  try {
    return await api.get(`/orders/collections/overdue${processedString}`);
  } catch (err) {
    console.error("Failed to collect installment");
    throw err;
  }
};

export const getAllInstallments = async () => {

  try {
    return await api.get(`/orders/installments/all`);
  } catch (err) {
    console.error("Failed to collect installment");
    throw err;
  }
};

export const updateSeller = async (orderId: string, sellerId: string) => {
  const processedString = `?order_id=${orderId}&seller_id=${sellerId}`
  try {
    return await api.patch(`/orders/seller${processedString}`);
  } catch (err) {
    console.error("Failed to update seller in order");
    throw err;
  }
}