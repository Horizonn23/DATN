// Test file to verify the new product service functions
// This can be used to manually test the functionality

import { useProductservice } from "@/api/service/productService";

export async function testRelatedProducts() {
  console.log("🧪 Testing Related Products Function...");

  try {
    const { getRelatedProducts } = useProductservice();
    const result = await getRelatedProducts("1");

    console.log("✅ Related Products Success:", {
      count: result?.length || 0,
      products: result?.map((p) => ({ id: p.id, name: p.name })) || [],
    });

    return result;
  } catch (error) {
    console.error("❌ Related Products Error:", error);
    throw error;
  }
}

export async function testSearchProducts() {
  console.log("🧪 Testing Search Products Function...");

  try {
    const { searchProducts } = useProductservice();
    const result = await searchProducts({
      searchTerm: "dog",
      page: 1,
      itemPerPage: 5,
    });

    console.log("✅ Search Products Success:", {
      totalProducts: result?.totalProducts || 0,
      currentPage: 1,
      productsFound: result?.products?.length || 0,
      products:
        result?.products?.map((p) => ({ id: p.id, name: p.name })) || [],
    });

    return result;
  } catch (error) {
    console.error("❌ Search Products Error:", error);
    throw error;
  }
}

// Usage example in a React component:
/*
import { testRelatedProducts, testSearchProducts } from "./path/to/this/file";

function TestComponent() {
  const runTests = async () => {
    try {
      await testRelatedProducts();
      await testSearchProducts();
      console.log("🎉 All tests completed!");
    } catch (error) {
      console.error("💥 Test failed:", error);
    }
  };

  return (
    <button onClick={runTests} className="bg-blue-500 text-white px-4 py-2 rounded">
      Test Product Functions
    </button>
  );
}
*/
