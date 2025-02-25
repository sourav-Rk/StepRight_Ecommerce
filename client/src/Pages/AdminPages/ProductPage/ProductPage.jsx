import AddProduct from "@/components/AdminComponent/Product/AddProduct"
import SidePage from "../SidePage"
import Header from "@/components/AdminComponent/Header/Header"
const AddProductPage = () => {
  return (
     <>
     <SidePage/>
     <Header name={'Add Product'}/>
     <AddProduct/>
     </>
  )
}

export default AddProductPage

