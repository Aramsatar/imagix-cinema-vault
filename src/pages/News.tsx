
import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import NewsSection from '@/components/home/NewsSection';

const NewsPage = () => {
  return (
    <PageLayout>
      <div className="py-12">
        <NewsSection />
      </div>
    </PageLayout>
  );
};

export default NewsPage;
