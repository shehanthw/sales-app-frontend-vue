import api from "./api";

export const getAllCustomers = async () => {
  try {
    return await api.get("/api/customers");
  } catch (err) {
    console.error("Failed to fetch customers");
    throw err;
  }
};

export const postCustomer = async (value: any) => {
  try {
    await api.post("/api/customers", value);
  } catch (err) {
    console.error("Failed to save customers");
    throw err;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    return await api.get(`/api/customers/${id}`);
  } catch (err) {
    console.error("Failed to save customers");
    throw err;
  }
};

export const putCustomer = async (id: number, value: any) => {
  try {
    await api.put(`/api/customers/${id}`, value);
  } catch (err) {
    console.error("Failed to update customers");
    throw err;
  }
};

export const removeCustomer = async (id: number) => {
  try {
    await api.delete(`/api/customers/${id}`);
  } catch (err) {
    console.error("Failed to delete customer");
    throw err;
  }
};