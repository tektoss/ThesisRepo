'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    subject: '',
    level: '',
    country: '',
    institution: '',
    abstract: '',
    type: '',
    file: null as File | null,
    language: 'en',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verify user via inested.com's JWT
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('inested_token=')[1]?.split(';')[0]}`,
        },
      });
      if (!response.ok) {
        router.push('https://inested.com/login');
        return;
      }
      const { userId } = await response.json();

      if (!formData.file) throw new Error('No file selected');

      // Upload file to Supabase Storage
      const filePath = `papers/${Date.now()}_${formData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('papers')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Save metadata to Supabase
      const { error } = await supabase.from('global_research_repository').insert({
        title: formData.title,
        authors: formData.authors.split(',').map((author) => author.trim()),
        abstract: formData.abstract,
        institution: formData.institution || null,
        country: formData.country,
        subject: formData.subject,
        level: formData.level,
        type: formData.type,
        file_path: filePath,
        user_id: userId,
      });

      if (error) throw error;

      alert('Submission successful!');
      onClose();
    } catch (error: any) {
      localStorage.setItem('pendingSubmission', JSON.stringify(formData));
      alert('Internet issue detected. Submission saved locally. Retry when online.');
    }
  };

  return (
    <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center px-4" role="dialog" aria-labelledby="upload-modal-title">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 id="upload-modal-title" className="text-lg font-semibold text-gray-900">{t('submitResearch')}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label={t('cancel')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">{t('formLanguage')}</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              {t('paperTitle')} * <span className="text-gray-500 text-xs" title={t('paperTitleTooltip')}>[?]</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={t('paperTitlePlaceholder')}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
              {t('authors')} * <span className="text-gray-500 text-xs" title={t('authorsTooltip')}>[?]</span>
            </label>
            <input
              id="authors"
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={t('authorsPlaceholder')}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              {t('subjectArea')} * <span className="text-gray-500 text-xs" title={t('subjectTooltip')}>[?]</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
              <option value="">{t('selectSubject')}</option>
              <option value="agri">{t('agriculture')}</option>
              <option value="cs">{t('computerScience')}</option>
              <option value="econ">{t('economics')}</option>
              <option value="edu">{t('education')}</option>
              <option value="env">{t('environmentalScience')}</option>
              <option value="med">{t('medicineHealth')}</option>
              <option value="math">{t('mathematics')}</option>
              <option value="physics">{t('physics')}</option>
              <option value="soc">{t('socialSciences')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              {t('educationLevel')} * <span className="text-gray-500 text-xs" title={t('levelTooltip')}>[?]</span>
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
              <option value="">{t('selectLevel')}</option>
              <option value="high-school">{t('highSchool')}</option>
              <option value="undergraduate">{t('undergraduate')}</option>
              <option value="community">{t('communityBased')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              {t('country')} * <span className="text-gray-500 text-xs" title={t('countryTooltip')}>[?]</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
              <option value="">{t('selectCountry')}</option>
              <option value="Nigeria">{t('nigeria')}</option>
              <option value="Kenya">{t('kenya')}</option>
              <option value="Ghana">{t('ghana')}</option>
              <option value="India">{t('india')}</option>
              <option value="Brazil">{t('brazil')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
              {t('institution')} <span className="text-gray-500 text-xs" title={t('institutionTooltip')}>[?]</span>
            </label>
            <input
              id="institution"
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={t('institutionPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
              {t('summary')} * <span className="text-gray-500 text-xs" title={t('summaryTooltip')}>[?]</span>
            </label>
            <textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={t('summaryPlaceholder')}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              {t('typeOfWork')} * <span className="text-gray-500 text-xs" title={t('typeTooltip')}>[?]</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            >
              <option value="">{t('selectType')}</option>
              <option value="article">{t('journalArticle')}</option>
              <option value="conference_paper">{t('conferencePaper')}</option>
              <option value="book">{t('book')}</option>
              <option value="book_chapter">{t('bookChapter')}</option>
              <option value="thesis">{t('thesis')}</option>
              <option value="dissertation">{t('dissertation')}</option>
              <option value="technical_report">{t('technicalReport')}</option>
              <option value="working_paper">{t('workingPaper')}</option>
              <option value="preprint">{t('preprint')}</option>
              <option value="review_article">{t('reviewArticle')}</option>
              <option value="case_study">{t('caseStudy')}</option>
              <option value="letter">{t('letter')}</option>
              <option value="patent">{t('patent')}</option>
              <option value="presentation">{t('presentation')}</option>
              <option value="poster">{t('poster')}</option>
              <option value="dataset">{t('dataset')}</option>
              <option value="software">{t('software')}</option>
              <option value="community_report">{t('communityReport')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
              {t('uploadFile')} * <span className="text-gray-500 text-xs" title={t('uploadTooltip')}>[?]</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
              <input
                id="pdfFile"
                type="file"
                name="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => document.getElementById('pdfFile')?.click()}
                className="text-blue-600 hover:text-blue-800"
                aria-label={t('choosePDF')}
              >
                {t('choosePDF')}
              </button>
              <p className="text-gray-500 text-sm mt-2">{t('maxFileSize')}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('offlineSubmission')} <span className="text-gray-500 text-xs" title={t('offlineTooltip')}>[?]</span>
            </label>
            <a
              href="https://zloyzjuofeecagpjcdvs.supabase.co/storage/v1/object/public/papers/offline-submission-form.pdf"
              download
              className="text-blue-600 hover:text-blue-800 text-sm"
              aria-label={t('downloadOfflineForm')}
            >
              {t('downloadOfflineForm')}
            </a>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="arxiv-button px-6 py-2 rounded-md font-medium flex-1">
              {t('submit')} Research
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}