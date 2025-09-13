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

  const handleFetchFeatureImages = async (query: string, page: number) => {
    if (loading) return;
    setLoading(true);
    const { images, totalCount } = await fetchFeatureImages({
      query,
      page: page
    });
    setImages((prev) => [...prev, ...images]);
    setTotalCount(totalCount);
    setLoading(false);
  };
  const handleGetNextPage = () => {
    if (loading) return;
    setPage(page + 1);
    handleFetchFeatureImages(query, page + 1);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
    setImages([]);
    handleFetchFeatureImages(query, 1);
  };

  useEffect(() => {
    if (loading) return;
    if (totalCount === 0 || (totalCount && totalCount / 10 <= page)) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  }, [totalCount, page, loading]);

  return {
    images,
    loading,
    isEnd,
    page,
    query,
    totalCount,
    onFetchFeatureImages: handleFetchFeatureImages,
    onGetNextPage: handleGetNextPage,
    onSearch: handleSearch
  };
};
