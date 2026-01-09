'use client';

import { useCallback, useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { onCloseModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';
import { ProductType } from '@/models/productType';
import {
  getAndParseConfig,
  updatePublicConfigDirect
} from '@/app/admin/lib/actions/public-config.actions';
import { formatImagePath } from '@/shared/utils/formatImagePath.utils';
import { getImageUrl } from '@/shared/utils/getImageUrl';
import Image from 'next/image';

const ITEM_TYPE = 'PRODUCT_TYPE';

interface DraggableProductTypeProps {
  productType: ProductType;
  index: number;
  moveProductType: (dragIndex: number, hoverIndex: number) => void;
}

// Draggable product type item
const DraggableProductType = ({
  productType,
  index,
  moveProductType
}: DraggableProductTypeProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveProductType(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  // Compose refs properly
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
      drop(node);
    },
    [drag, drop]
  );

  return (
    <div
      ref={setRefs}
      className={`p-4 mb-2 bg-white border-2 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50 border-dashed' : 'border-gray-200'
      } ${isOver ? 'border-logo-orange-border bg-orange-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
          <div>
            <Image
              src={
                productType.image_url
                  ? formatImagePath(
                      getImageUrl('product-types', productType.image_url)
                    )
                  : '/cup.png'
              }
              alt={productType.name}
              width={128}
              height={128}
              unoptimized
              className="rounded-lg w-16 h-16 object-cover shrink-0"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{productType.name}</h4>
            <p className="text-sm text-gray-500">{productType.short_name}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">#{index + 1}</div>
      </div>
    </div>
  );
};

interface ArrangeProductTypeModalProps {
  readonly onRefresh?: () => void;
  readonly productTypesObj: Record<string, ProductType>;
}

export default function ArrangeProductTypeModal({
  onRefresh,
  productTypesObj
}: ArrangeProductTypeModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const fetchProductTypesConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAndParseConfig<string[]>('product_types');

      if (data) {
        setProductTypes(data.map((id) => productTypesObj[id]));
      }
    } catch (error) {
      console.error('Failed to fetch product types config:', error);
    } finally {
      setIsLoading(false);
    }
  }, [productTypesObj]);

  useEffect(() => {
    if (Object.keys(productTypesObj).length > 0) {
      fetchProductTypesConfig();
    }
  }, [productTypesObj]);

  // Handle drag and drop reordering
  const moveProductType = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setProductTypes((prevTypes: ProductType[]) => {
        const newTypes = [...prevTypes];
        const [removed] = newTypes.splice(dragIndex, 1);
        newTypes.splice(hoverIndex, 0, removed as ProductType);
        return newTypes;
      });
    },
    [productTypes]
  );

  // Save the new order to database
  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      // Create array with minimal data for storage
      const orderData = productTypes.map((pt) => pt.id);

      await updatePublicConfigDirect('product_types', {
        value: JSON.stringify(orderData),
        description: 'Order configuration for product types display'
      });

      handleClose(true);
    } catch (error) {
      console.error('Failed to save product type order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (refresh?: boolean) => {
    onCloseModal(MODAL_ID.ARRANGE_PRODUCT_TYPES);
    if (refresh && onRefresh) {
      onRefresh();
    }
  };

  return (
    <dialog id={MODAL_ID.ARRANGE_PRODUCT_TYPES} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Arrange Product Types</h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop to reorder product types. The order will be saved
              for display purposes.
            </p>

            <div className="max-h-96 overflow-y-auto mb-4">
              {productTypes.length > 0 && (
                <DndProvider backend={HTML5Backend}>
                  {productTypes.map((productType, index) => (
                    <DraggableProductType
                      key={productType.id}
                      productType={productType}
                      index={index}
                      moveProductType={moveProductType}
                    />
                  ))}
                </DndProvider>
              )}

              {productTypes.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 py-8">
                  No product types found
                </p>
              )}
            </div>
          </>
        )}

        <div className="modal-action">
          <button
            type="button"
            onClick={() => handleClose()}
            disabled={isSaving}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={isSaving || isLoading || productTypes.length === 0}
            className="btn bg-logo-orange-border hover:bg-logo-orange-border/90 text-white"
          >
            {isSaving ? (
              <>
                <div className="loading loading-spinner loading-sm" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Order'
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => handleClose()}>close</button>
      </form>
    </dialog>
  );
}
