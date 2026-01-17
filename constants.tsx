
import React from 'react';
import { Book, Globe, Search, Bell, Info, MessageSquare, LayoutGrid, FileText, Mic, MicOff } from 'lucide-react';
import { NewsItem, LibrarySection } from './types';

export const UNIVERSITY_NAME = "جامعة الأمير عبد القادر للعلوم الإسلامية";
export const LIBRARY_TITLE = "المكتبة المركزية والمكتبات الفرعية";

export const NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: 'افتتاح التسجيلات للاستفادة من قواعد البيانات الرقمية',
    date: '15 أكتوبر 2024',
    excerpt: 'تعلن المكتبة المركزية عن فتح باب التسجيل للباحثين للولوج إلى قواعد البيانات العالمية.',
    image: 'https://picsum.photos/seed/lib1/400/250'
  },
  {
    id: '2',
    title: 'ندوة حول البحث العلمي والمصادر الرقمية',
    date: '20 أكتوبر 2024',
    excerpt: 'تنظيم ندوة علمية حول طرق الاستفادة القصوى من المستودع الرقمي للجامعة.',
    image: 'https://picsum.photos/seed/lib2/400/250'
  }
];

export const LIBRARY_SECTIONS: LibrarySection[] = [
  {
    title: "المستودع الرقمي (DSpace)",
    description: "الوصول إلى الأطروحات والمذكرات المرفوعة رقمياً.",
    icon: 'FileText',
    link: "https://dspace.univ-emir-constantine.edu.dz/jspui/"
  },
  {
    title: "البوابة الجزائرية للمجلات (ASJP)",
    description: "تصفح المجلات العلمية المحكمة الصادرة عن الجامعة.",
    icon: 'Globe',
    link: "https://www.asjp.cerist.dz"
  },
  {
    title: "الفهرس الجماعي الجزائري (CCDZ)",
    description: "البحث في مقتنيات المكتبة عبر النظام الموحد.",
    icon: 'Search',
    link: "http://www.ccdz.cerist.dz"
  }
];

export const getIcon = (name: string, size = 24, className = "") => {
  const icons: Record<string, any> = {
    Book, Globe, Search, Bell, Info, MessageSquare, LayoutGrid, FileText, Mic, MicOff
  };
  const IconComp = icons[name] || Info;
  return <IconComp size={size} className={className} />;
};
