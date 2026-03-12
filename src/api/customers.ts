import api from "./api";

export const getAllCustomers = async () => {
  try {
    return await api.get("/customers");
  } catch (err) {
    console.error("Failed to fetch customers");
    throw err;
  }
};

export const postCustomer = async (value: any) => {
  try {
    await api.post("/customers", value);
  } catch (err) {
    console.error("Failed to save customers");
    throw err;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    return await api.get(`/customers/${id}`);
  } catch (err) {
    console.error("Failed to save customers");
    throw err;
  }
};

export const putCustomer = async (id: number, value: any) => {
  try {
    await api.put(`/customers/${id}`, value);
  } catch (err) {
    console.error("Failed to update customers");
    throw err;
  }
};

export const removeCustomer = async (id: number) => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (err) {
    console.error("Failed to delete customer");
    throw err;
  }
};