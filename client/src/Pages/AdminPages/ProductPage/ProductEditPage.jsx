import Header from "@/components/AdminComponent/Header/Header"
import EditProduct from "@/components/AdminComponent/Product/EditProduct/EditProduct"
import Sidebar from "@/components/AdminComponent/Sidebar"
const EditProductPage = () => {
  return (
     <>
     <Sidebar/>
     <Header name={'Edit Product'}/>
     <EditProduct/>
     </>
    
  )
}

export default EditProductPage
