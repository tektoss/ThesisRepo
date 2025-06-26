'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { PaperFormData } from '../types';
import { validateFile, validateFormData, sanitizeInput } from '../lib/validation';
import { universities } from '../lib/universities';
import { useUI } from '../context/UIContext';
import { useClickOutside } from '../lib/useClickOutside';
import { SUBJECT_OPTIONS, LEVEL_OPTIONS, COUNTRY_OPTIONS, SUBMISSION_TYPE_OPTIONS } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { triggerRefresh } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Omit<PaperFormData, 'language'>>({
    title: '',
    authors: '',
    subject: '',
    level: '',
    country: '',
    institution: '',
    abstract: '',
    type: 'article',
    file: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [institutionQuery, setInstitutionQuery] = useState('');
  const [filteredInstitutions, setFilteredInstitutions] = useState<string[]>([]);

  useEffect(() => {
    if (institutionQuery) {
      setFilteredInstitutions(
        universities.filter(uni =>
          uni.toLowerCase().includes(institutionQuery.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredInstitutions([]);
    }
  }, [institutionQuery]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    if (name === 'institution') {
      setInstitutionQuery(sanitizedValue);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
      const error = validateFile(file);
      setErrors(prev => ({ ...prev, file: error || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validationErrors = validateFormData(formData as PaperFormData);
    if (!formData.file) {
      validationErrors.file = 'A file is required for submission.';
    } else {
        const fileError = validateFile(formData.file);
        if (fileError) {
            validationErrors.file = fileError;
        }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!formData.file) {
        setErrors(prev => ({ ...prev, file: 'A file is required.' }));
        setIsSubmitting(false);
        return;
      }

      const { userId } = { userId: '... a placeholder or real user ID from a proper auth flow ...' };

      const filePath = `papers/${Date.now()}_${formData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('papers')
        .upload(filePath, formData.file);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      const { error: dbError } = await supabase.from('global_research_repository').insert({
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
        submitted: new Date().toISOString(),
      });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      alert(t('submissionSuccessful'));
      triggerRefresh();
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrors({ form: error.message || t('submissionFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  useClickOutside(modalRef, handleClose);
  
  const isFormValid = useCallback(() => {
    const { title, authors, subject, level, country, abstract, type, file } = formData;
    return !!(title && authors && subject && level && country && abstract && type && file && Object.values(errors).every(e => !e));
  }, [formData, errors]);

  const renderTextField = (id: keyof Omit<PaperFormData, 'file'>, labelKey: string, type: string, required: boolean, placeholderKey?: string) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block form-label">
        {t(labelKey)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        onChange={handleInputChange}
        className="form-input"
        placeholder={placeholderKey ? t(placeholderKey) : ''}
        required={required}
      />
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  const renderSelectField = (id: keyof Omit<PaperFormData, 'file'>, labelKey: string, options: readonly { value: string, label: string }[], required: boolean) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block form-label">
        {t(labelKey)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={id}
        onChange={handleInputChange}
        className="form-input"
        required={required}
      >
        <option value="">{t('select_option')}</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{t(opt.label)}</option>)}
      </select>
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  const renderTextareaField = (id: keyof Omit<PaperFormData, 'file'>, labelKey: string, required: boolean) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block form-label">
        {t(labelKey)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        rows={5}
        onChange={handleInputChange}
        className="form-input"
        placeholder={t('summary_placeholder')}
        required={required}
      />
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  const renderFileUploadField = (id: keyof PaperFormData, labelKey: string, required: boolean) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block form-label">
        {t(labelKey)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-border border-dashed rounded-lg cursor-pointer bg-surface hover:bg-border transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-text-secondary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-text-secondary">
              <span className="font-semibold">{t('clickToUpload')}</span> {t('orDragAndDrop')}
            </p>
            <p className="text-xs text-text-secondary">{t('fileTypes')}</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {formData.file && (
        <p className="text-sm text-text-secondary mt-2">
          {t('selectedFile')}: {formData.file.name}
        </p>
      )}
      {errors.file && <p className="form-error">{errors.file}</p>}
    </div>
  );

  const renderAutocompleteField = (id: keyof Omit<PaperFormData, 'file'>, labelKey: string, required: boolean) => (
    <div className="space-y-2 relative">
      <label htmlFor={id} className="block form-label">
        {t(labelKey)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type="text"
        name={id}
        value={institutionQuery}
        onChange={handleInputChange}
        autoComplete="off"
        className="form-input"
        placeholder={t('institutionPlaceholder')}
        required={required}
      />
      {filteredInstitutions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-40 overflow-auto">
          {filteredInstitutions.map(uni => (
            <li
              key={uni}
              onClick={() => {
                setInstitutionQuery(uni);
                setFormData(prev => ({ ...prev, institution: uni }));
                setFilteredInstitutions([]);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-border"
            >
              {uni}
            </li>
          ))}
        </ul>
      )}
      {errors[id] && <p className="form-error">{errors[id]}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="card w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
      >
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <h2 id="modal-title" className="h2">
            {t('submitYourResearch')}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-border transition-colors"
            aria-label={t('cancel')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 -mr-2 mt-6">
          <div className="space-y-6">
            {renderTextField('title', 'title', 'text', true, 'title_placeholder')}
            {renderTextField('authors', 'authors', 'text', true, 'authors_placeholder')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField('subject', 'subjectArea', SUBJECT_OPTIONS, true)}
              {renderSelectField('level', 'educationLevel', LEVEL_OPTIONS, true)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSelectField('country', 'country', COUNTRY_OPTIONS, true)}
              {renderSelectField('type', 'submissionType', SUBMISSION_TYPE_OPTIONS, true)}
            </div>
            {renderAutocompleteField('institution', 'institution', false)}
            {renderTextareaField('abstract', 'summary', true)}
            {renderFileUploadField('file', 'uploadFile', true)}
            {errors.form && <p className="form-error text-center">{errors.form}</p>}
          </div>
        </form>

        <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t border-border">
          <button type="button" onClick={handleClose} className="btn btn-secondary">
            {t('cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : t('submitResearch')}
          </button>
        </div>
      </div>
    </div>
  );
} 