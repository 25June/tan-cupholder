'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { createOrder, OrderState } from '@/app/lib/public-order.actions';
import { getProductById } from '@/app/lib/product.actions';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import PageLoader from '@/components/page-loader/PageLoader';

const initialState: OrderState = { message: null, errors: {} };

export default function PaymentPage() {
  const t = useTranslations('PaymentPage');
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params['product-id'] as string;
  const quantity = Number(searchParams.get('quantity') || '1');
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<OrderState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          setIsLoading(true);
          const productData = await getProductById(productId);
          setProduct(productData);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const discountedPrice = product.price * (1 - product.sale / 100);
    return discountedPrice * quantity;
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.set(
      'products',
      JSON.stringify([{ productId: productId, quantity: quantity }])
    );
    formData.set('quantity', quantity.toString());
    formData.set('totalPrice', calculateTotalPrice().toString());

    try {
      const result = await createOrder(initialState, formData);
      if (result.orderId) {
        // Redirect to success page or show success message
        router.push(`/order-status/${result.orderId}`);
        // You can redirect to a success page here
        // window.location.href = `/order-success/${result.orderId}`;
      } else if (result.message) {
        setState({
          message: result.message,
          errors: result.errors
        });
      }
    } catch (error) {
      setState({
        message: 'Failed to create order. Please try again.',
        errors: {}
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('productNotFound')}
          </h1>
          <p className="text-gray-600">{t('productNotFoundDesc')}</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const discountedPrice = product.price * (1 - product.sale / 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-logo-orange-border w-full">
        <div className="flex justify-between items-center gap-4 p-4 mx-auto max-w-4xl w-full sm:px-6 lg:px-8">
          <div>
            <div className="cursor-pointer mb-2">
              <ArrowLeftIcon
                className="w-8 h-8 text-white border-white border-2 hover:bg-white hover:text-logo-orange-border rounded-full p-1 transition-all duration-300"
                onClick={() => router.back()}
              />
            </div>
            <div className=" text-white">
              <h1 className="text-2xl font-bold">{t('checkoutTitle')}</h1>
              <p className="text-gray-100">{t('checkoutSubtitle')}</p>
            </div>
          </div>
          <div className="max-w-24">
            <Image
              src="/logo.png"
              alt="TAN cupholder logo"
              width={200}
              height={200}
              className={`rounded-full w-full h-full`}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('productDetails')}
                </h2>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          product.product_image?.name
                            ? formatImagePath(
                                getImageUrl(
                                  product.id,
                                  product.product_image.name
                                )
                              )
                            : '/cup.png'
                        }
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.type_name}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {t('quantity')}: {quantity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {t('price')}: {formatPrice(discountedPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t('priceSummary')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('unitPrice')}</span>
                      <span className="font-medium">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('quantity')}:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          {t('total')}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('customerInfo')}
                </h2>

                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleFormSubmit(formData);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-logo-orange-border focus:outline-none focus:ring-1 focus:ring-logo-orange sm:text-sm"
                      placeholder={t('fullNamePlaceholder')}
                    />
                    {state.errors?.customerName && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.customerName[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-logo-orange-border focus:outline-none focus:ring-1 focus:ring-logo-orange sm:text-sm"
                      placeholder={t('emailPlaceholder')}
                    />
                    {state.errors?.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.customerEmail[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-logo-orange-border focus:outline-none focus:ring-1 focus:ring-logo-orange-border sm:text-sm"
                      placeholder={t('phonePlaceholder')}
                    />
                    {state.errors?.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.customerPhone[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('address')}
                    </label>
                    <textarea
                      id="customerAddress"
                      name="customerAddress"
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-logo-orange-border focus:outline-none focus:ring-1 focus:ring-logo-orange-border sm:text-sm"
                      placeholder={t('addressPlaceholder')}
                    />
                    {state.errors?.customerAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.customerAddress[0]}
                      </p>
                    )}
                  </div>

                  {state.message && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm text-red-600">{state.message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-logo-orange-border text-white py-3 px-4 rounded-md hover:bg-logo-orange focus:outline-none focus:ring-2 focus:ring-logo-orange-border focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('creatingOrder')}
                      </div>
                    ) : (
                      t('createOrder', { price: formatPrice(totalPrice) })
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
