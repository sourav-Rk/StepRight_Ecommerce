import axiosInstance from "../axios";

//API call to get the sales report
export const getSalesReport = async(params) => {
    try {
        const response =   await axiosInstance.get(`/admin/sales-report?${params}`);
        return response.data
    }
    catch(error){
        console.log(error);
        throw error?.response?.data || error;
    }
}

//API call to download the pdf
export const downloadSalesReportPdf = async(queryString) => {

    try{
        const response = await axiosInstance.get(`/admin/sales-report/download/pdf?${queryString}`,{
            responseType : "blob",
        });
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
} 

export const downloadSalesReportExcel = async (queryString) => {
  try {
     const response = await axiosInstance.get(`/admin/sales-report/download/excel?${queryString}`, {
      responseType: "blob", 
    });
    return response.data

  } catch (error) {
    throw error?.response?.data || error
   
  }
};


//dashboard

//API call to get saleschart data
export const getSalesChartData = async(filter) => {
    try{
        const response = await axiosInstance.get(`/admin/salesdashboard?filter=${filter}`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}

//API call to get BestSelling Products
export const fetchBestSellingProducts = async () =>{
    try{
        const response = await axiosInstance(`/admin/bestSellingProducts`);
        return response.data
    }
    catch(error){
        throw error?.response?.data || error
    }
}
