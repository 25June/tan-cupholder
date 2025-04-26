import { mockProducts } from '@/mocks/products';
import { GetProductsResponse, Product } from '@/models/product';

export const getProducts = async (
  page: number,
  limit: number,
  keyword: string,
  total: number,
  keywords?: string
) => {
  return new Promise<GetProductsResponse>((resolve) => {
    setTimeout(() => {
      const nextPage = page + 1;
      console.log({ nextPage });
      console.log('keywords', keywords);
      if (typeof keywords === 'string') {
        const filteredProducts = mockProducts.filter((product) =>
          product.name
            .toLocaleLowerCase()
            .includes(keywords.toLocaleLowerCase())
        );
        resolve({
          data: filteredProducts.slice(0, limit),
          total: filteredProducts.length,
          isEnd: false,
          page: 1,
          keywords: keywords,
        });
      } else if (keyword) {
        if ((nextPage - 1) * limit > total) {
          resolve({
            data: [],
            total: total,
            isEnd: true,
            page: page,
            keywords: keywords,
          });
          return;
        }
        const filteredProducts = mockProducts.filter((product) =>
          product.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
        );
        resolve({
          data: filteredProducts.slice(
            (nextPage - 1) * limit,
            nextPage * limit > total ? total : nextPage * limit
          ),
          total: filteredProducts.length,
          isEnd: false,
          page: nextPage,
          keywords: keywords,
        });
      } else {
        if ((nextPage - 1) * limit > total) {
          resolve({
            data: [],
            total: total,
            isEnd: true,
            page: page,
            keywords: keywords,
          });
          return;
        }

        resolve({
          data: mockProducts.slice(
            (nextPage - 1) * limit,
            nextPage * limit > mockProducts.length ? total : nextPage * limit
          ),
          total: mockProducts.length,
          isEnd: false,
          page: nextPage,
          keywords: '',
        });
      }
    }, 1000);
  });
};

export const getProduct = (id: string) => {
  return new Promise<Product | null>((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((product) => product.id === id);
      resolve(product || null);
    }, 1000);
  });
};
