import { useState, useEffect } from 'react';
import { fetchFeatureImages } from '../lib/actions/image-feature.actions';
import { FeatureImage } from '@/models/featureImage';

export const useImageFeature = () => {
  const [images, setImages] = useState<FeatureImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);

  const handleFetchFeatureImages = async (query: string, newPage: number) => {
    if (loading) return;
    setLoading(true);
    const { images, totalCount } = await fetchFeatureImages({
      query,
      page: newPage
    });
    if (images.length === 0) {
      setIsEnd(true);
    }
    setImages((prev) => [...prev, ...images]);
    setTotalCount(totalCount);
    setLoading(false);
  };
  const handleGetNextPage = () => {
    if (loading) return;
    setPage((prev) => prev + 1);
    handleFetchFeatureImages(query, page + 1);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(0);
    setImages([]);
    handleFetchFeatureImages(query, 0);
  };

  const handleRefresh = () => {
    setImages([]);
    setPage(0);
    handleFetchFeatureImages(query, 0);
  };

  const handleDelete = (ids: string[]) => {
    setImages((prev) => prev.filter((image) => !ids.includes(image.id)));
    setTotalCount((prev) => prev - ids.length);
  };

  useEffect(() => {
    if (loading) return;
    if (totalCount && totalCount / 10 <= page) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, [totalCount, page, loading]);
  console.log('totalCount', totalCount, page, isEnd);

  return {
    images,
    loading,
    isEnd,
    page,
    query,
    totalCount,
    onFetchFeatureImages: handleFetchFeatureImages,
    onGetNextPage: handleGetNextPage,
    onSearch: handleSearch,
    onDelete: handleDelete,
    onRefresh: handleRefresh
  };
};
