import SidePage from "../SidePage"
import Header from "@/components/AdminComponent/Header/Header"
import ProductList from "@/components/AdminComponent/Product/ProductList.jsx"
const ProductListPage = () => {
  return (
     <>
     <SidePage/>
     <Header name={'Products'}/>
     <ProductList/>
     </>
  )
}

export default ProductListPage

